/*
 * FilePath: \src\api\apollo\errors\util.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:45:36
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

/**
 * 关联引用不能删除时的错误代码
 */
export const DataIntegrityErrorCode = 'DataIntegrityError'
export const CharacterFilterWarn = 'CharacterFilterWarn'

/**
 * 判断是否是使用特殊字符
 *
 * @export
 * @param {*} graphQLErrors
 * @returns {Boolean}
 */
export function isCharacterFilterWarn(graphQLErrors) {
  const errs = graphQLErrors
  return (
    errs &&
    errs.length > 0 &&
    errs[0].extensions &&
    errs[0].extensions.code === CharacterFilterWarn
  )
}

/**
 * 判断是否关联引用不能删除时的错误
 *
 * @export
 * @param {*} graphQLErrors
 * @returns {Boolean}
 */
export function isDataIntegrityError(graphQLErrors) {
  const errs = graphQLErrors
  return (
    errs &&
    errs.length > 0 &&
    errs[0].extensions &&
    errs[0].extensions.code === DataIntegrityErrorCode
  )
}

/**
 * 签名错误代码
 * SignatureAuthenticationWarn
 */
export const SignatureAuthenticationCode = 'SignatureAuthenticationWarn'

/**
 * 判断是否为签名错误
 *
 * @param {object[]} graphQLErrors
 * @returns {Boolean}
 */
export function isSignError(graphQLErrors) {
  const errs = graphQLErrors
  return (
    errs &&
    errs.length > 0 &&
    errs[0].extensions &&
    errs[0].extensions.code === SignatureAuthenticationCode
  )
}
