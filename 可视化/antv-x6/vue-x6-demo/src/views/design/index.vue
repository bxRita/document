<template>
  <div class="wrap">
    <div class="content">
      <div class="sider" id="erStencil">sider</div>
      <div class="panel">
        <!--画板顶部工具栏-->
        <div class="toolbar">
          <tool-bar v-if="isReady" @change="changeGraph" />
        </div>
        <!--中间画板区-->
        <div class="x6-graph" id="erContainer">design</div>
      </div>
      <!--右侧属性栏-->
      <div class="config">
        <config-panel v-if="isReady" />
      </div>
    </div>
  </div>
</template>

<script>
import { Shape, FunctionExt } from '@antv/x6'
import { GridLayout } from '@antv/layout'
import store from '@/store'
import BaseGraph from '@/utils/graph'
import './index.less'
import { ComponentType, color } from '@/config'
import ConfigPanel from '@/components/config-panel/index.vue'
const { Rect, Circle } = Shape
import { setCurrentGraph } from '@/utils/graphUtil'
import ToolBar from '@/components/Toolbar.vue'
import { getClassComponent, getEnumComponent } from '@/components/nodes'
import { getAllModel } from '@/api/base'
import DefConfig from '@/components/nodes/common'

export default {
  name: 'Design',
  inheritAttrs: false,
  components: {
    ConfigPanel,
    ToolBar
  },
  data() {
    return {
      isReady: false,
      baseGraph: null, // 画布对象
      resizeFn: null, // 浏览器resize函数
      stencil: null, // 左侧组件区控件
      initScale: {
        // 画布初始比例大小
        sx: 1,
        sy: 1
      }
    }
  },
  created() {},
  mounted() {
    this.initGraph()
    this.initStencil()
    this.initResizeEvent()
    this.initGraphEvent()
    this.initGraphData()
    this.isReady = true
  },
  methods: {
    /**
     * @description 顶部操作区 操作界面后更新graph 数据到store
     */
    changeGraph() {
      let graph = this.baseGraph.graph,
        pageData = graph.toJSON()
      this.updateDesignGraph(pageData.cells)
    },
    async initGraphData() {
      let graph = this.baseGraph.graph
      let graphData = localStorage.getItem('GRAPH_DATA_ITEM')
      console.log('graphData', JSON.parse(graphData))
      let arrObj = await getAllModel()
      console.log(arrObj)
      let layoutData = {
        nodes: [],
        edges: []
      }
      if (arrObj) {
        let arrs = arrObj.data,
          len = arrs.length
        for (let i = 0; i < len; i++) {
          let temp = arrs[i]
          if (temp.modelType === ComponentType.C) {
            const cfg = new DefConfig(color.blue)
            layoutData.nodes.push(
              Object.assign(cfg.config, {
                id: `${i}`,
                cellType: ComponentType.C,
                bxDatas: temp,
                component: getClassComponent()
              })
            )
          } else if (temp.modelType === ComponentType.E) {
            const cfg = new DefConfig(color.yellow)
            layoutData.nodes.push(
              Object.assign(cfg.config, {
                id: `${i}`,
                cellType: ComponentType.E,
                bxDatas: temp,
                component: getEnumComponent()
              })
            )
          } else {
            layoutData.edges.push()
          }
        }

        const gridLayout = new GridLayout({
          type: 'dagre',
          rankdir: 'LR',
          align: 'UL',
          ranksep: 30,
          nodesep: 15,
          controlPoints: true
        })

        const model = gridLayout.layout(layoutData)
        console.log('model', model)
        // 将设计区数据存储到store
        if (model) {
          this.updateDesignGraph(model.nodes.concat(model.edges))
          graph.fromJSON(model)
        }
      }
    },
    updateDesignGraph(datas) {
      this.$store.dispatch('design/initDesignCells', datas)
    },
    /**
     * 初始化设计界面的画布
     */
    initGraph() {
      const { width, height } = this.getContainerSize()
      /** 初始化画布 */
      this.baseGraph = new BaseGraph({
        container: document.getElementById('erContainer'),
        // 画布选择
        selecting: {
          enabled: true,
          multiple: true,
          rubberband: true,
          movable: true,
          showNodeSelectionBox: true
        },
        width,
        height,
        grid: {
          size: 10,
          visible: true
        },
        embedding: {
          enabled: true,
          findParent({ node }) {
            const bbox = node.getBBox()
            return this.getNodes().filter(node => {
              // 只有 data.parent 为 true 的节点才是父节点
              const data = node.getData()
              if (data && data.parent) {
                const targetBBox = node.getBBox()
                return bbox.isIntersectWithRect(targetBBox)
              }
              return false
            })
          }
        }
      })

      setCurrentGraph(this.baseGraph.graph)
    },
    /**
     * @description 绑定画布事件
     */
    initGraphEvent() {
      const { graph } = this.baseGraph
      const container = document.getElementById('erContainer')
      // 鼠标移入节点时，显示链接桩
      graph.on(
        'node:mouseenter',
        FunctionExt.debounce(() => {
          // const ports = container.querySelectorAll('.x6-port-body') // 展示链接桩
          // this.showPorts(ports, true)
        }),
        500
      )
      // 鼠标移出节点时，隐藏链接桩
      graph.on('node:mouseleave', () => {
        // const ports = container.querySelectorAll('.x6-port-body') // 隐藏链接桩
        // this.showPorts(ports, false)
      })

      graph.on('node:collapse', ({ node, e }) => {
        e.stopPropagation()
        node.toggleCollapse()
        const collapsed = node.isCollapsed()
        const cells = node.getDescendants()
        cells.forEach(n => {
          if (collapsed) {
            n.hide()
          } else {
            n.show()
          }
        })
      })

      graph.on('cell:added', ({ cell, index, options }) => {
        store.dispatch('design/addCell', cell.store.data)
      })
      // 删除节点快捷键绑定
      graph.bindKey(['del', 'backspace'], () => {
        const cells = graph.getSelectedCells()
        if (cells.length) {
          graph.removeCells(cells)
        }
      })
      // 撤销
      graph.bindKey(
        ['ctrl+z'],
        e => {
          this.undo()
        },
        'keyup'
      )
      // 重置
      graph.bindKey(
        ['ctrl+y'],
        e => {
          this.redo()
        },
        'keyup'
      )
      graph.bindKey(['ctrl+plus'], e => this.scaleView(e, 'up'))
      graph.bindKey(['ctrl+-'], e => this.scaleView(e, 'down'))
    },
    /**
     * @description 画布放大缩小
     */
    scaleView(e, flag) {
      e.preventDefault()
      if (flag === 'up') {
        this.initScale.sx += 0.1
        this.initScale.sy += 0.1
      } else {
        this.initScale.sx -= 0.1
        this.initScale.sy -= 0.1
      }

      const { graph } = this.baseGraph
      graph.scale(this.initScale.sx, this.initScale.sy)
    },
    /**
     * @description 撤销
     */
    undo() {
      const { graph } = this.baseGraph
      graph.history.undo()
    },
    /**
     * @description 重做
     */
    redo() {
      const { graph } = this.baseGraph
      graph.history.redo()
    },
    /**
     * @description 显示连接桩
     */
    showPorts(ports, show) {
      for (let i = 0, len = ports.length; i < len; i = i + 1) {
        ports[i].style.visibility = show ? 'visible' : 'hidden'
      }
    },
    /**
     * @description 初始化左侧组件区
     */
    initStencil() {
      this.stencil = this.baseGraph.initStencil(
        document.getElementById('erStencil')
      )
      // const { graph } = this.baseGraph
      const r1 = new Rect({
        width: 70,
        height: 40,
        attrs: {
          rect: { fill: color.blue, stroke: '#4B4A67', strokeWidth: 2 },
          text: { text: '实体类', fill: 'white' }
        },
        data: {
          type: ComponentType.C
        }
      })
      const r2 = new Rect({
        width: 70,
        height: 40,
        attrs: {
          rect: { fill: '#FE854F', stroke: '#4B4A67', strokeWidth: 2 },
          text: { text: '枚举', fill: 'white' }
        },
        data: {
          type: ComponentType.E
        }
      })

      const c = new Circle({
        width: 60,
        height: 60,
        attrs: {
          circle: { fill: '#31D0C6', strokeWidth: 2, stroke: '#4B4A67' },
          text: { text: '标量', fill: 'white' }
        },
        data: {
          type: ComponentType.S
        }
      })

      this.stencil.load([r1, r2], 'basic')
      // this.stencil.load([c], 'combination')
    },
    /**
     * @description 获取可视区的宽高
     */
    getContainerSize() {
      return {
        width: document.body.offsetWidth - 610,
        height: document.body.offsetHeight - 50
      }
    },
    /**
     * @description 监听resize事件
     */
    initResizeEvent() {
      this.resizeFn = () => {
        const { width, height } = this.getContainerSize()
        this.baseGraph.resize(width, height)
      }
      window.addEventListener('resize', this.resizeFn)
    }
  },
  /**
   * @description 组件销毁时
   */
  destroyed() {
    window.removeEventListener('resize', this.resizeFn)
  }
}
</script>

<style lang="less" scoped></style>
