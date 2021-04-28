<template>
  <div class="config">
    <component :is="curComp" v-bind="op" v-if="curComp" ref="configPanel" />
  </div>
</template>

<script>
import ConfigGrid from './ConfigGrid/index.vue'
import ConfigEnum from './ConfigEnum/index.vue'
import ConfigClass from './ConfigClass/index.vue'
import ConfigEdge from './ConfigEdge/index.vue'
import './index.less'
import { globalGridAttr } from './global'
import { getCurrentGraph } from '@/utils/graphUtil'
import { ComponentType, X6CellType } from '@/config'

const PanelType = {
  G: 'grid',
  N: 'node',
  E: X6CellType.edge
}
export default {
  name: 'Index',
  components: {
    ConfigGrid,
    ConfigEnum,
    ConfigClass,
    ConfigEdge
  },
  data() {
    return {
      curComp: ConfigGrid,
      type: PanelType.G,
      op: {
        id: '',
        cellData: null,
        graph: getCurrentGraph(),
        globalGridAttr
      }
    }
  },
  mounted() {
    setTimeout(() => {
      this.boundEvent()
    }, 200)
  },
  watch: {
    type(newVal, oldVal) {
      if (newVal != oldVal) {
        this.$emit('selectNode', this.op.cellData)
      }
    }
  },
  methods: {
    boundEvent() {
      this.op.graph.on('blank:click', () => {
        this.type = PanelType.G
        this.op.cellData = null
        this.showAttrPanel(this.type)
      })
      this.op.graph.on('cell:click', ({ cell, view }) => {
        this.type = cell.isNode() ? PanelType.N : PanelType.E
        this.op.id = cell.id
        this.op.cellData = (cell && cell.store && cell.store.data) || null
        this.showAttrPanel(this.type, this.op.cellData.cellType)
      })
    },
    showAttrPanel(type, subType) {
      switch (type) {
        case PanelType.G:
          this.curComp = ConfigGrid
          break
        case PanelType.N:
          if (subType == ComponentType.E) {
            this.curComp = ConfigEnum
          } else {
            this.curComp = ConfigClass
          }
          break
        case PanelType.E:
          this.curComp = ConfigEdge
          break
        default:
          this.curComp = ConfigGrid
          break
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
