import request from '@/utils/request'

export function getArticleInfo(articlePageNum, queryKeyword) {
  return request({
    url: '/science-articles/getArticleInfo',
    method: 'get',
    params: { articlePageNum, queryKeyword }
  })
}

export function deleteArticle(articleId) {
  return request({
    url: '/science-articles/deleteArticle',
    method: 'post',
    params: { articleId }
  })
}

export function deleteBatchArticle(data) {
  return request({
    url: '/science-articles/deleteBatchArticle',
    method: 'post',
    data
  })
}

export function getArticleCategories() {
  return request({
    url: '/science-article-categories/getArticleCategories',
    method: 'get'
  })
}

export function addArticle(data) {
  return request({
    url: '/science-articles/addArticle',
    method: 'post',
    data
  })
}

export function editorArticle(data) {
  return request({
    url: '/science-articles/editorArticle',
    method: 'post',
    data
  })
}

export function getArticleCounts() {
  return request({
    url: '/science-articles/getArticleCounts',
    method: 'get'
  })
}

export function getCategoryCounts() {
  return request({
    url: '/science-article-categories/getCategoryCounts',
    method: 'get'
  })
}
