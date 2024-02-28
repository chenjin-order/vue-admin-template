import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userName: '',
  userAvatar: '',
  userRole: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, userName) => {
    state.userName = userName
  },
  SET_AVATAR: (state, userAvatar) => {
    state.userAvatar = userAvatar
  },
  SET_ROLE: (state, userRole) => {
    state.userRole = userRole
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: username.trim(), userPasswordHash: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { userName, userAvatar, userRole } = data.userInfo
        commit('SET_NAME', userName)
        commit('SET_AVATAR', userAvatar)
        commit('SET_ROLE', userRole)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('SET_TOKEN', '')
        commit('SET_NAME', '')
        commit('SET_AVATAR', '')
        commit('SET_ROLE', '')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLE', '')
      removeToken() // must remove  token  first
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

