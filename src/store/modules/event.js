import { addEvent, deleteEvent, deleteBatchEvent, editorEvent } from '@/api/event'
const state = {

}

const mutations = {

}

const actions = {

  // delete article
  deleteEvent({ commit }, eventId) {
    return new Promise((resolve, reject) => {
      deleteEvent(eventId).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // delete batch article
  deleteBatchEvent({ commit }, eventIdList) {
    return new Promise((resolve, reject) => {
      deleteBatchEvent(eventIdList).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // editor event
  editorEvent({ commit }, addEventInfo) {
    const {
      eventId,
      eventName,
      eventTypeId,
      eventLocation,
      eventStartDate,
      eventEndDate,
      eventSeverityLevel,
      eventDescription,
      eventSource,
      eventImageUrl
    } = addEventInfo
    return new Promise((resolve, reject) => {
      editorEvent({
        eventId: eventId,
        eventName: eventName,
        eventTypeId: eventTypeId,
        eventLocation: eventLocation,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        eventSeverityLevel: eventSeverityLevel,
        eventDescription: eventDescription,
        eventSource: eventSource,
        eventImageUrl: eventImageUrl
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // add event
  addEvent({ commit }, addEventInfo) {
    const {
      eventName,
      eventTypeId,
      eventLocation,
      eventStartDate,
      eventEndDate,
      eventSeverityLevel,
      eventDescription,
      eventSource,
      eventImageUrl
    } = addEventInfo
    return new Promise((resolve, reject) => {
      addEvent({
        eventName: eventName,
        eventTypeId: eventTypeId,
        eventLocation: eventLocation,
        eventStartDate: eventStartDate,
        eventEndDate: eventEndDate,
        eventSeverityLevel: eventSeverityLevel,
        eventDescription: eventDescription,
        eventSource: eventSource,
        eventImageUrl: eventImageUrl
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
