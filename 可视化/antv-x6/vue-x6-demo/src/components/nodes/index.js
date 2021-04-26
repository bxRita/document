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
import { color, ComponentType } from '@/config'
import GqlClass from './GqlClass.vue'
import GqlEnum from './GqlEnum.vue'
/**
 *
 * @returns 返回类别vue组件
 */
export function getClassComponent() {
  return {
    template: '<gql-class></gql-class>',
    components: {
      GqlClass
    }
  }
}
/**
 *
 * @returns 返回枚举的vue组件
 */
export function getEnumComponent() {
  return {
    template: '<gql-enum></gql-enum>',
    components: {
      GqlEnum
    }
  }
}

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
      cellType: ComponentType.C,
      bxDatas: {
        modelName: ComponentType.C,
        modelType: '',
        modelDesc: '',
        fieldsList: [
          {
            fieldType: 'String',
            fieldName: 'id',
            fieldIsNull: true,
            defaultValue: '',
            primaryType: '0'
          }
        ]
      },
      component: getClassComponent()
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
      cellType: ComponentType.E,
      bxDatas: {
        modelName: ComponentType.E,
        modelType: '',
        modelDesc: '',
        fieldsList: [{ fieldName: 'Y' }, { fieldName: 'N' }]
      },
      component: getEnumComponent()
    })
  )
}
