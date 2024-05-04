import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
    method: 'post',
    data
  })
}

export function signup(data) {
  return request({
    url: '/users/signup',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/users/info',
    method: 'get',
    params: { token }
  })
}

export function getUsers() {
  return request({
    url: '/users/getUsers',
    method: 'get'
  })
}

export function deleteUser(userId) {
  return request({
    url: '/users/deleteUser',
    method: 'post',
    params: { userId }
  })
}

export function deleteBatchUser(data) {
  return request({
    url: '/users/deleteBatchUser',
    method: 'post',
    data
  })
}

export function editorUser(data) {
  return request({
    url: '/users/editorUser',
    method: 'post',
    data
  })
}

export function addUser(data) {
  return request({
    url: '/users/addUsers',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

export function userList(userPageNum, queryKeyword) {
  return request({
    url: '/users/all',
    method: 'get',
    params: { userPageNum, queryKeyword }
  })
}

export function getUserCounts() {
  return request({
    url: '/users/getUserCounts',
    method: 'get'
  })
}

export function getFavoriteArticlesCount(userName) {
  return request({
    url: '/user-favorite-articles/getFavoriteArticlesCount',
    method: 'post',
    params: { userName }
  })
}

export function getFollowedDisastersCount(userName) {
  return request({
    url: '/user-followed-disasters/getFollowedDisastersCount',
    method: 'post',
    params: { userName }
  })
}

export function getUserFavoriteArticles(userName, userFavoriteArticlesPageNum) {
  return request({
    url: '/user-favorite-articles/getUserFavoriteArticles',
    method: 'get',
    params: { userName, userFavoriteArticlesPageNum }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/users/getUserInfo',
    method: 'get',
    params: { token }
  })
}

export function updatePhone(data) {
  return request({
    url: '/users/updatePhone',
    method: 'post',
    data
  })
}

export function updateEmail(data) {
  return request({
    url: '/users/updateEmail',
    method: 'post',
    data
  })
}

export function updatePW(data) {
  return request({
    url: '/users/updatePW',
    method: 'post',
    data
  })
}
