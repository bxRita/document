/*
 * FilePath: \src\api\base\index.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-26 10:22:51
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import client from './client'
import gqlAllModel from './all-models.gql'

/**
 * @description 查询所有模型
 */
export async function getAllModel() {
  const res = await client.query({
    query: gqlAllModel
  })
  return res.data.list || []
}
