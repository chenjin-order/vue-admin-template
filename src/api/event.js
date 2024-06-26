import request from '@/utils/request'

export function getEventTypes() {
  return request({
    url: '/disaster-event-types/getEventTypes',
    method: 'get'
  })
}

export function addEvent(data) {
  return request({
    url: '/disaster-events/addEvent',
    method: 'post',
    data
  })
}

export function editorEvent(data) {
  return request({
    url: '/disaster-events/editorEvent',
    method: 'post',
    data
  })
}

export function getEventInfo(eventPageNum, queryKeyword) {
  return request({
    url: '/disaster-events/getEventInfo',
    method: 'get',
    params: { eventPageNum, queryKeyword }
  })
}

export function deleteEvent(eventId) {
  return request({
    url: '/disaster-events/deleteEvent',
    method: 'post',
    params: { eventId }
  })
}

export function deleteBatchEvent(data) {
  return request({
    url: '/disaster-events/deleteBatchEvent',
    method: 'post',
    data
  })
}

export function getEventNameList() {
  return request({
    url: '/disaster-events/getEventNameList',
    method: 'get'
  })
}

export function getEventCounts() {
  return request({
    url: '/disaster-events/getEventCounts',
    method: 'get'
  })
}

export function getEventWeek() {
  return request({
    url: '/disaster-events/getEventWeek',
    method: 'get'
  })
}

export function getEventPageInfo(eventPageNum, queryKeyword) {
  return request({
    url: '/disaster-events/getEventPageInfo',
    method: 'get',
    params: { eventPageNum, queryKeyword }
  })
}

export function getEventTypeCount() {
  return request({
    url: '/disaster-events/getEventTypeCount',
    method: 'get'
  })
}

export function getEventDetailById(eventId) {
  return request({
    url: '/disaster-events/getEventDetailById',
    method: 'get',
    params: { eventId }
  })
}

export function getHomeEventInfo(homeEventPageNum) {
  return request({
    url: '/disaster-events/getHomeEventInfo',
    method: 'get',
    params: { homeEventPageNum }
  })
}

export function getEventTypesInfo() {
  return request({
    url: '/disaster-event-types/getEventTypesInfo',
    method: 'get'
  })
}
