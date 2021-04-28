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
import gqlCreateModel from './create-model.gql'
import gqlUpdateModel from './updateModel.gql'
import gqlDeleteModel from './delete-model.gql'

/**
 * @description 查询所有模型
 */
export async function getAllModel() {
  const res = await client.query({
    query: gqlAllModel
  })
  return res.data.list.data || []
}

/**
 * 新增模型
 * @param {Object} where
 * @param {Object} create
 * @param {Object} update
 */
export async function createModel(data) {
  let param = {
    mutation: gqlCreateModel,
    variables: { data }
  }
  const res = await client.mutate(param)
  return res.data || {}
}
/**
 * 更新模型
 * @param {Object} where
 * @param {Object} create
 * @param {Object} update
 */
export async function updateModel(data) {
  let param = {
    mutation: gqlUpdateModel,
    variables: { data }
  }
  const res = await client.mutate(param)
  return res.data || {}
}

/**
 * 删除模型
 * @param {Object} where
 * @param {Object} create
 * @param {Object} update
 */
export async function deleteModel(data) {
  let param = {
    mutation: gqlDeleteModel,
    variables: { data }
  }
  const res = await client.mutate(param)
  return res.data || {}
}
