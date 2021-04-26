/*
 * FilePath: \src\api\system\index.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 15:48:00
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import client from './client'
import gqlSysDictionary from './sys-dictionary.gql'

/**
 * @description 查询列表信息
 * @param {Object} where  查询条件
 * @param {Object} orderBy 排序条件
 * @param {Number} first 条数
 * @param {Number} skip 索引
 */
export async function pagination(where = {}, orderBy, first = 30, skip = 0) {
  const res = await client.query({
    query: gqlSysDictionary,
    variables: { where, orderBy, first, skip }
  })
  return res.data || []
}

export async function getSysDictField(type) {
  let data = await pagination({ type: { equals: type } })
  return data.list
}
