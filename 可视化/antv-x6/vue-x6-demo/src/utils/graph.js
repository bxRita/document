/*
 * 画布
 * FilePath: \src\utils\graph.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-01 10:47:52
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { Graph, X6Node, Shape } from '@antv/x6'
import { CellController, EventController, X6Stencil } from './index'
import _ from 'lodash'
// import ReactDOM from 'react-dom';

export default class X6BaseGraph {
  constructor(graphOptions) {
    /** 创建X6画布实例 */
    const defaultCfg = this.getDefaultCfg()
    this.graph = new Graph({
      ...defaultCfg,
      ...graphOptions
    })
    this.init()
  }

  init() {
    this.cellController = new CellController(this)
    this.eventController = new EventController(this)
  }

  static getInstance() {
    if (!this.graph) return this.graph

    new Error('没有生成画布示例')
  }

  initStencil(stencilDom) {
    return new X6Stencil(this, stencilDom)
  }

  resize(width, height) {
    this.graph.resize(width, height)
  }
  /**
   * 获取画布默认配置项
   * @returns {}
   * @memberof X6BaseGraph
   */
  getDefaultCfg() {
    const defaultCfg = {
      /** 无限画布设置 */
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true
      },
      resizing: {
        enabled: true,
        restricted: true
      },
      /** 画布网格 */
      grid: {
        visible: true,
        size: 20,
        type: 'doubleMesh',
        args: [
          {
            color: '#888'
            // thickness: 1,
          }
          // {
          //   color: '#ddd',
          //   thickness: 1,
          //   factor: 4,
          // },
        ]
      },
      /** 全局连线配置 */
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        highlight: true,
        snap: true,
        createEdge() {
          return new Shape.Edge({
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
              name: 'er'
            },
            zIndex: 0,
            bxDatas: {
              resourceField: '',
              targetField: '',
              relType: ''
            }
          })
        },
        validateConnection({
          sourceView,
          targetView,
          sourceMagnet,
          targetMagnet
        }) {
          if (sourceView === targetView) {
            return false
          }
          if (!sourceMagnet) {
            return false
          }
          if (!targetMagnet) {
            return false
          }
          return true
        }
      },
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: 'rgba(223,234,255)'
            }
          }
        }
      },
      history: true,
      /** 对齐线 */
      snapline: {
        enabled: true
      },
      /** 滚轮缩放 */
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        minScale: 0.5,
        maxScale: 2
      },
      keyboard: {
        enabled: true
      },
      clipboard: {
        enabled: true
      }
    }
    return defaultCfg
  }

  /**
   * 更新画布内容
   * @param {GraphData} graphData 画布元素数据
   * @memberof X6BaseGraph
   */
  updateGraph(graphData) {
    if (!graphData) {
      throw new Error('graphData must be defined first!')
    }
    const { addNodesData, addEdgesData } = this.graphContentDiff(graphData)
    this.graph.batchUpdate('updateGraph', () => {
      if (addNodesData && addNodesData.length > 0) {
        this.cellController.addNodes(addNodesData)
      }
      if (addEdgesData && addEdgesData.length > 0) {
        this.cellController.addEdges(addEdgesData)
      }
    })
  }

  /**
   * 画布缩放
   * @param {number} factor 缩放比例尺 number | 'fit' | 'real'
   * @memberof X6BaseGraph
   */
  zoomGraph(factor) {
    if (typeof factor === 'number') {
      this.graph.zoom(factor)
    } else if (factor === 'fit') {
      this.graph.zoomToFit({ padding: 12 })
    } else if (factor) {
      this.graph.scale(1)
      this.graph.centerContent()
    }
  }

  /**
   * 移动节点到画布中央
   * @param {(X6Node | string)} node
   * @memberof X6BaseGraph
   */
  focusNodeToGraphCenter(node) {
    if (node instanceof X6Node) {
      this.graph.centerCell(node)
    } else {
      const temp = this.cellController.findNodeById(node)
      if (temp) {
        this.graph.centerCell(temp)
      }
    }
  }

  /**
   * 将Nodes置于画布最前方
   * @param {X6Node[]} nodes
   * @memberof X6BaseGraph
   */
  bringNodesToFront(nodes) {
    nodes.forEach(node => {
      node.toBack()
    })
  }

  /**
   * 将Nodes置于画布最后方
   * @param {X6Node[]} nodess
   * @memberof X6BaseGraph
   */
  bringNodesToBack(nodes) {
    nodes.forEach(node => {
      node.toBack()
    })
  }

  /**
   * 清空画布内容
   * @memberof X6BaseGraph
   */
  clearGraph() {
    // todo
  }

  /**
   * 注册监听事件
   * @param {[]} events
   * @memberof X6BaseGraph
   */
  registerEvent(events) {
    this.eventController.registerEvent(events)
  }

  /** 画布内容Diff */
  graphContentDiff(graphData) {
    const { nodes: nodesData, edges: edgesData } = graphData

    // 新增节点数据
    const addNodesData = []
    nodesData.forEach(nodeData => {
      const findNode = this.cellController.findNodeById(nodeData.id)
      if (!findNode) {
        addNodesData.push(nodeData)
      }
    })

    // 保持、更新、移除的节点
    const retainNodes = []
    const updateNodes = []
    const removeNodes = []
    this.cellController.nodes.forEach(node => {
      const findNodeData = nodesData.find(nodeData => nodeData.id === node.id)
      if (!findNodeData) {
        removeNodes.push(node)
      } else {
        // !!! 目前仅支持节点data数据变化, 才认为更新
        if (_.isEqual(node.data, findNodeData.data)) {
          retainNodes.push(node)
        } else {
          updateNodes.push(node)
          this.cellController.updateNode(node, findNodeData)
        }
      }
    })

    // 新增连线数据
    const addEdgesData = []
    edgesData.forEach(edgeData => {
      if (!edgeData.id) {
        return
      }
      const findEdge = this.cellController.findEdgeById(edgeData.id)
      if (!findEdge) {
        addEdgesData.push(edgeData)
      }
    })

    // 保持、更新、移除的连线
    const retainEdges = []
    const updateEdges = []
    const removeEdges = []
    this.cellController.edges.forEach(edge => {
      const findEdgeData = edgesData.find(edgeData => edgeData.id === edge.id)
      if (!findEdgeData) {
        removeEdges.push(edge)
      } else {
        // !!! 目前仅支持连线data数据变化, 才认为更新
        if (_.isEqual(edge.data, findEdgeData.data)) {
          retainEdges.push(edge)
        } else {
          updateEdges.push(edge)
          this.cellController.updateEdge(edge, findEdgeData)
        }
      }
    })

    this.cellController.removeNodes(removeNodes)
    this.cellController.removeEdges(removeEdges)

    return {
      addNodesData,
      addEdgesData
    }
  }
}
