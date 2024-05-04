import request from '@/utils/request'

export function addResponse(data) {
  return request({
    url: '/disaster-responses/addResponse',
    method: 'post',
    data
  })
}

export function getResponseTypes() {
  return request({
    url: '/disaster-response-types/getResponseTypes',
    method: 'get'
  })
}

export function getResponseInfo(responsePageNum, queryKeyword) {
  return request({
    url: '/disaster-responses/getResponseInfo',
    method: 'get',
    params: { responsePageNum, queryKeyword }
  })
}

export function deleteResponse(responsesId) {
  return request({
    url: '/disaster-responses/deleteResponse',
    method: 'post',
    params: { responsesId }
  })
}

export function deleteBatchResponse(data) {
  return request({
    url: '/disaster-responses/deleteBatchResponse',
    method: 'post',
    data
  })
}

export function editorResponse(data) {
  return request({
    url: '/disaster-responses/editorResponse',
    method: 'post',
    data
  })
}

export function getResponseCounts() {
  return request({
    url: '/disaster-responses/getResponseCounts',
    method: 'get'
  })
}

export function getResponseDetail(eventId) {
  return request({
    url: '/disaster-responses/getResponseDetail',
    method: 'get',
    params: { eventId }
  })
}
