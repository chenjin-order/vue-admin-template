import { addResponse, deleteResponse, deleteBatchResponse, editorResponse } from '@/api/response'

const state = {

}

const mutations = {

}

const actions = {
  // add article
  addResponse({ commit }, addResponseInfo) {
    const {
      responsesEventId,
      responseTypeId,
      responseDetails
    } = addResponseInfo
    return new Promise((resolve, reject) => {
      addResponse({
        responsesEventId: responsesEventId,
        responseTypeId: responseTypeId,
        responseDetails: responseDetails
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // editor article
  editorResponse({ commit }, editorResponseInfo) {
    const {
      responsesId,
      responsesEventId,
      responseTypeId,
      responseDetails
    } = editorResponseInfo
    return new Promise((resolve, reject) => {
      editorResponse({
        responsesId: responsesId,
        responsesEventId: responsesEventId,
        responseTypeId: responseTypeId,
        responseDetails: responseDetails
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // delete response
  deleteResponse({ commit }, responsesId) {
    return new Promise((resolve, reject) => {
      deleteResponse(responsesId).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // delete batch article
  deleteBatchResponse({ commit }, responsesIdList) {
    return new Promise((resolve, reject) => {
      deleteBatchResponse(responsesIdList).then(() => {
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
