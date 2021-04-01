/*
 * FilePath: \src\components\nodes\index.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-01 15:44:17
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import DefConfig from './common'
import GqlClass from './GqlClass.vue'
import GqlEnum from './GqlEnum.vue'
import { color } from '@/config'

/**
 * @description  创建类别节点
 * @param {*} graph
 * @param {*} options
 * @returns
 */
export function getClassNode(graph, options) {
  const cfg = new DefConfig(color.blue)
  return graph.createNode(
    Object.assign(cfg.config, options, {
      component: {
        template: '<gql-class></gql-class>',
        components: {
          GqlClass
        }
      }
    })
  )
}

/**
 * 创建枚举节点
 * @param {*} graph
 * @param {*} options
 * @returns
 */
export function getEnumNode(graph, options) {
  const cfg = new DefConfig(color.yellow)
  return graph.createNode(
    Object.assign(cfg.config, options, {
      component: {
        template: '<gql-enum></gql-enum>',
        components: {
          GqlEnum
        }
      }
    })
  )
}
