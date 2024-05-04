import {
  deleteArticle,
  deleteBatchArticle,
  addArticle,
  editorArticle,
  increaseArticleLikes,
  decreaseArticleLikes,
  increaseArticleViews
} from '@/api/article'

const state = {
}

const mutations = {
}

const actions = {

  // delete article
  deleteArticle({ commit }, articleId) {
    return new Promise((resolve, reject) => {
      deleteArticle(articleId).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // delete batch article
  deleteBatchArticle({ commit }, articleIdList) {
    return new Promise((resolve, reject) => {
      deleteBatchArticle(articleIdList).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // editor article
  editorArticle({ commit }, editorArticleInfo) {
    const {
      articleId,
      articleTitle,
      articleContent,
      articleCreatedBy,
      articleCategoryId,
      articleUpdatedAt
    } = editorArticleInfo
    return new Promise((resolve, reject) => {
      editorArticle({
        articleId: articleId,
        articleTitle: articleTitle,
        articleContent: articleContent,
        articleCreatedBy: articleCreatedBy,
        articleCategoryId: articleCategoryId,
        articleUpdatedAt: articleUpdatedAt
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // add article
  addArticle({ commit }, addArticleInfo) {
    const {
      articleTitle,
      articleContent,
      articleCreatedBy,
      articleCategoryId,
      articleCreatedAt
    } = addArticleInfo
    return new Promise((resolve, reject) => {
      addArticle({
        articleTitle: articleTitle,
        articleContent: articleContent,
        articleCreatedBy: articleCreatedBy,
        articleCategoryId: articleCategoryId,
        articleCreatedAt: articleCreatedAt
      }).then(response => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // increase articleViews
  increaseArticleViews({ commit }, articleId) {
    return new Promise((resolve, reject) => {
      increaseArticleViews(articleId).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // increase articleLikes
  increaseArticleLikes({ commit }, likeData) {
    return new Promise((resolve, reject) => {
      increaseArticleLikes(likeData).then(() => {
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // increase articleLikes
  decreaseArticleLikes({ commit }, likeData) {
    return new Promise((resolve, reject) => {
      decreaseArticleLikes(likeData).then(() => {
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
