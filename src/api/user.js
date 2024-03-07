import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/users/login',
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

export function userList(pageNum) {
  return request({
    url: '/users/all',
    method: 'get',
    params: { pageNum }
  })
}
