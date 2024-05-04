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

export function getArticlePageInfo(articlePageNum, queryKeyword) {
  return request({
    url: '/science-articles/getArticlePageInfo',
    method: 'get',
    params: { articlePageNum, queryKeyword }
  })
}

export function getArticleHeat() {
  return request({
    url: '/science-articles/getArticleHeat',
    method: 'get'
  })
}

export function getArticleDetail(articleId, userName) {
  return request({
    url: '/science-articles/getArticleDetail',
    method: 'get',
    params: { articleId, userName }
  })
}

export function increaseArticleViews(articleId) {
  return request({
    url: '/science-articles/increaseArticleViews',
    method: 'post',
    params: { articleId }
  })
}

export function increaseArticleLikes(data) {
  return request({
    url: '/science-articles/increaseArticleLikes',
    method: 'post',
    data
  })
}

export function decreaseArticleLikes(data) {
  return request({
    url: '/science-articles/decreaseArticleLikes',
    method: 'post',
    data
  })
}

export function getHomeArticleInfo() {
  return request({
    url: '/science-articles/getHomeArticleInfo',
    method: 'get'
  })
}
