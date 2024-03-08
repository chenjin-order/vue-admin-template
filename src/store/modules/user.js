import { login, logout, getInfo, addUser, deleteUser, deleteBatchUser, editorUser } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import CryptoJS from 'crypto-js'

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
      login({ userName: username.trim(), userPassword: password }).then(response => {
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
  // delete user info
  deleteUser({ commit }, userId) {
    return new Promise((resolve, reject) => {
      deleteUser(userId).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // delete batch user
  deleteBatchUser({ commit }, userIdList) {
    return new Promise((resolve, reject) => {
      deleteBatchUser(userIdList).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // editor user info
  editorUser({ commit }, editorUserInfo) {
    const {
      userId,
      userName,
      userPassword,
      userAvatar,
      userEmail,
      userPhone,
      userRole,
      userUpdatedAt
    } = editorUserInfo
    const cryptoUserPassword = CryptoJS.SHA256(userPassword).toString()
    return new Promise((resolve, reject) => {
      editorUser({
        userId: userId,
        userName: userName,
        userPassword: cryptoUserPassword,
        userAvatar: userAvatar,
        userEmail: userEmail,
        userPhone: userPhone,
        userRole: userRole,
        userUpdatedAt: userUpdatedAt
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // add user info
  addUser({ commit }, addUserInfo) {
    const {
      userName,
      userPassword,
      userAvatar,
      userEmail,
      userPhone,
      userRole,
      userCreatedAt
    } = addUserInfo
    const cryptoUserPassword = CryptoJS.SHA256(userPassword).toString()
    return new Promise((resolve, reject) => {
      addUser({
        userName: userName,
        userPassword: cryptoUserPassword,
        userAvatar: userAvatar,
        userEmail: userEmail,
        userPhone: userPhone,
        userRole: userRole,
        userCreatedAt: userCreatedAt
      }).then(response => {
        resolve()
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

