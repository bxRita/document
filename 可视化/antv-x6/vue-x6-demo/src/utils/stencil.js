/*
 * FilePath: \src\utils\stencil.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-01 14:03:57
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { Addon } from '@antv/x6'
import { getClassNode, getEnumNode } from '@/components/nodes'
import { ComponentType } from '@/config'

export default class X6Stencil {
  constructor(x6BaseGraph, stencilContainerDom) {
    this.graph = x6BaseGraph.graph
    this.stencil = new Addon.Stencil({
      title: 'Components',
      target: this.graph,
      placeholder: 'Search by shape name',
      notFoundText: 'Not Found',
      collapsable: true,
      search(cell, keyword) {
        return cell.shape.indexOf(keyword) !== -1
      },
      stencilGraphWidth: 280,
      // search: { rect: true },
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          graphHeight: 180,
          layoutOptions: {
            columns: 2,
            marginX: 10
          }
        }
        // {
        //   name: 'combination',
        //   title: '业务节点',
        //   layoutOptions: {
        //     columns: 2,
        //     marginX: 10
        //   },
        //   graphHeight: 260
        // }
      ],
      getDropNode: draggingNode => {
        // 根据类型返回指定 自定义vue节点
        const { store } = draggingNode,
          nodeData = store.data,
          busData = nodeData.data
        switch (busData.type) {
          case ComponentType.C:
          case ComponentType.I:
            return getClassNode(this.graph)
          case ComponentType.E:
            return getEnumNode(this.graph)
          default:
            return draggingNode.clone()
        }
      }
    })
    stencilContainerDom.appendChild(this.stencil.container)
  }

  /**
   * 向组中添加组件
   * @param {*} nodes
   * @param {*} groupName
   */
  load(nodes, groupName) {
    this.stencil.load(nodes, groupName)
  }
}
