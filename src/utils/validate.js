/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // 去除字符串两端的空白字符
  const trimmedStr = str.trim()

  // 验证用户名规则：仅支持中英文、数字和下划线，且不能为纯数字
  const isUsernameValid = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(trimmedStr) && !/^\d+$/.test(trimmedStr)

  // 验证电子邮箱规则：简单的电子邮箱验证正则
  const isEmailValid = /^\w{3,}(\.\w+)*@[A-z0-9]+(\.[A-z]{2,5}){1,2}$/.test(trimmedStr)

  // 验证手机号规则：这里假设手机号是11位数字，可以根据实际情况调整
  const isPhoneValid = /^1[3456789]\d{9}$/.test(trimmedStr)

  return isUsernameValid || isEmailValid || isPhoneValid
}
