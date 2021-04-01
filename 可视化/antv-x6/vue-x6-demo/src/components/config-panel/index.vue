<template>
  <div class="config">
    <config-grid
      v-show="type === 'grid'"
      :globalGridAttr="globalGridAttr"
      :id="id"
      :cellData="cellData"
      :graph="graph"
    />
    <config-enum
      v-show="type === 'node' && subType === 'Enum'"
      :globalGridAttr="globalGridAttr"
      :id="id"
      :cellData="cellData"
      :graph="graph"
    />
    <config-class
      v-show="type === 'node' && subType !== 'Enum'"
      :globalGridAttr="globalGridAttr"
      :id="id"
      :cellData="cellData"
      :graph="graph"
    />
    <config-edge
      v-show="type === 'edge'"
      :globalGridAttr="globalGridAttr"
      :id="id"
      :cellData="cellData"
      :graph="graph"
    />
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
      type: 'grid',
      id: '',
      globalGridAttr: globalGridAttr,
      cellData: null,
      subType: 'enum',
      graph: getCurrentGraph()
    }
  },
  mounted() {},
  methods: {
    boundEvent() {
      this.graph.on('blank:click', () => {
        this.type = 'grid'
      })
      this.graph.on('cell:click', ({ cell, view }) => {
        this.type = cell.isNode() ? 'node' : 'edge'
        this.id = cell.id
        this.cellData = (cell && cell.store && cell.store.data) || null
        this.subType = this.cellData.bxDatas.type
        console.log('-----cellData: ', this.subType, this.cellData)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
