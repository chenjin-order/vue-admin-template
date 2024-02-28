import { asyncRoutes, constantRoutes } from '@/router'

function hasPermission(userRole, route) {
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
  }
}

const actions = {
  generateRoutes({ commit }, userRole) {
    return new Promise(resolve => {
      let accessedRoutes
      if (userRole.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, userRole)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
