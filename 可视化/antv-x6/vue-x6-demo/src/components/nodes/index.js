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
import { color, ComponentType, X6CellType } from '@/config'
import GqlClass from './GqlClass.vue'
import GqlEnum from './GqlEnum.vue'
/**
 * @description 获取连线通用配置
 * @param {*} param0
 * @returns
 */
export function getEdgeCommonCfg(
  { sourceId, targetId, labelText, sourcePort, targetPort },
  otherOption
) {
  return {
    ...otherOption,
    shape: X6CellType.edge,
    source: { cell: sourceId, port: sourcePort },
    target: { cell: targetId, port: targetPort },
    labels: [labelText],
    attrs: {
      line: {
        stroke: '#5F95FF',
        strokeWidth: 1,
        targetMarker: {
          name: 'classic',
          size: 8
        }
      }
    },
    router: {
      name: 'normal' // 可选值：normal,orth,oneSide,manhattan,metro,er
    },
    zIndex: 0
  }
}
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
        modelName: 'table',
        modelType: ComponentType.C,
        modelDesc: '',
        fieldsList: [
          {
            fieldType: 'String',
            fieldName: 'id',
            fieldIsNull: false,
            defaultValue: '',
            primaryType: '2'
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
        modelName: 'enum',
        modelType: ComponentType.E,
        modelDesc: '',
        fieldsList: [
          { fieldName: 'Y', fieldType: 'String', primaryType: '0' },
          { fieldName: 'N', fieldType: 'String', primaryType: '0' }
        ]
      },
      component: getEnumComponent()
    })
  )
}
