import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/signup'] // no redirect whitelist

const whiteListPrefixes = ['/homepage', '/articlePage', '/eventPage']

function isInWhiteList(path) {
  // 检查是否在基础白名单中
  if (whiteList.includes(path)) {
    return true
  }

  // 检查路径是否是白名单前缀的子路径
  for (const prefix of whiteListPrefixes) {
    if (path.startsWith(prefix)) {
      return true
    }
  }

  return false
}

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userName
      if (hasGetUserInfo) {
        // 假设已经在store中存储了用户角色
        const userRole = store.getters.userRole
        if (userRole === 'user' && from.path === '/' && to.path === '/404') {
          // 如果用户是user角色，则重定向到homepage
          next({ path: '/homepage' })
        } else {
          if (userRole === 'admin' || userRole === 'editor') {
            await store.dispatch('permission/changRoutes', userRole)
          } else if (userRole === 'user') {
            const basePaths = ['/homepage', '/articlePage', '/eventPage']
            const specificPaths = ['/accountSettings/', '/phoneSettings/', '/passwordSettings/', '/emailSettings/']
            if (specificPaths.some(specificPath => to.path.startsWith(specificPath))) {
              await store.dispatch('permission/settingsRoutes')
            } else if (basePaths.some(basePath => to.path.startsWith(basePath))) {
              await store.dispatch('permission/homeRoutes')
            }
          }
          // console.log(store.getters.permission_routes)
          // 否则，假设是admin或editor角色，可以访问dashboard
          next()
        }
      } else {
        try {
          // get user info
          const { userInfo: { userRole }} = await store.dispatch('user/getInfo')
          const accessRoutes = await store.dispatch('permission/generateRoutes', userRole)
          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          next({ ...to, replace: true })
          NProgress.done()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (isInWhiteList(to.path)) {
      // in the free login whitelist, go directly
      await store.dispatch('permission/setRoutes')
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
