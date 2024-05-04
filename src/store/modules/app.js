import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  topbar: {
    opened: Cookies.get('topbarStatus') ? !!+Cookies.get('topbarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_TOPBAR: state => {
    state.topbar.opened = !state.topbar.opened
    state.topbar.withoutAnimation = false
    if (state.topbar.opened) {
      Cookies.set('topbarStatus', 1)
    } else {
      Cookies.set('topbarStatus', 0)
    }
  },
  CLOSE_TOPBAR: (state, withoutAnimation) => {
    Cookies.set('topbarStatus', 0)
    state.topbar.opened = false
    state.topbar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleTopBar({ commit }) {
    commit('TOGGLE_TOPBAR')
  },
  closeTopBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_TOPBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
