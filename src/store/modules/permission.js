import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(userRole, route) {
  // if (route.meta && route.meta.userRole) {
  //   return !!route.meta.userRole.includes(userRole)
  // } else {
  //   return true
  // }
  if (route.meta && route.meta.userRole) {
    return !!route.meta.userRole.includes(userRole)
  } else {
    return true
  }
}

export function filterAsyncRoutes(routes, userRole) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(userRole, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, userRole)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  CHANGE_ROUTES(state, newRoutes) {
    state.routes = newRoutes
  }
}

const actions = {
  generateRoutes({ commit }, userRole) {
    return new Promise(resolve => {
      var accessedRoutes
      // 根据用户角色过滤路由
      if (userRole.includes('admin')) {
        // 超级管理员可以访问所有路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, 'admin')
      } else if (userRole.includes('editor')) {
        // 普通管理员角色有特定的访问权限
        accessedRoutes = filterAsyncRoutes(asyncRoutes, 'editor')
      } else if (userRole.includes('user')) {
        // 普通用户有最基础的访问权限
        accessedRoutes = filterAsyncRoutes(asyncRoutes, 'user')
      } else {
        // 未知角色，可能返回空路由或默认路由
        accessedRoutes = [] // 或者你可以设置一个默认的路由数组
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  changRoutes({ commit }, userRole) {
    const newRoutes = this.getters.permission_routes.map(route => {
      const newRoute = { ...route }
      if (newRoute.meta) {
        if (userRole === 'admin' && newRoute.meta.userRole[0] === 'user') {
          newRoute.hidden = true
        }
        // console.log(newRoute.hidden)
        // console.log(newRoute.meta.userRole[0])
      }
      return newRoute
    })
    commit('CHANGE_ROUTES', newRoutes)
  },
  homeRoutes({ commit }) {
    return new Promise(resolve => {
      const specificPaths = ['/accountSettings', '/phoneSettings', '/passwordSettings', '/emailSettings']
      const newRoutes = this.getters.permission_routes.map(route => {
        const newRoute = { ...route }
        if (specificPaths.some(path => route.path.startsWith(path))) {
          newRoute.hidden = true
        }
        return newRoute
      })
      commit('CHANGE_ROUTES', newRoutes)
      resolve()
    })
  },
  settingsRoutes({ commit }) {
    return new Promise(resolve => {
      const newRoutes = this.getters.permission_routes.map(route => {
        const newRoute = { ...route }
        if ((['accountSettings', 'phoneSettings', 'passwordSettings', 'emailSettings'].includes(newRoute.name))) {
          newRoute.hidden = false
        } else {
          newRoute.hidden = true
        }
        return newRoute
      })
      commit('CHANGE_ROUTES', newRoutes)
      resolve()
    })
  },
  reversalRoutes({ commit }) {
    return new Promise(resolve => {
      const newRoutes = this.getters.permission_routes.map(route => {
        const newRoute = { ...route }
        newRoute.hidden = !newRoute.hidden
        return newRoute
      })
      commit('CHANGE_ROUTES', newRoutes)
      resolve()
    })
  },
  setRoutes({ commit }) {
    return new Promise(resolve => {
      commit('SET_ROUTES', asyncRoutes[5])
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
