<template>
  <div class="enum">
    <a-card :title="bxData.modelName" :bordered="false" size="small">
      <div v-for="(item, idx) in bxData.fieldsList" :key="idx">
        <b>{{ item.fieldName }}</b>
      </div>
    </a-card>
  </div>
</template>

<script>
import globalStore from '@/store'

// 组件默认展示值
const DEFAULT = {
  modelName: '枚举',
  fieldsList: [{ fieldName: 'Y' }, { fieldName: 'N' }]
}

export default {
  name: 'GqlEnum',
  inheritAttrs: false,
  inject: ['getGraph', 'getNode'],
  components: {},
  data() {
    return {
      id: null,
      bxData: DEFAULT
    }
  },
  watch: {
    id(newVal) {
      if (newVal) {
        const nodeData = globalStore.getters['design/getCellById'](newVal)
        nodeData && (this.bxData = nodeData.bxDatas)
      }
    }
  },
  mounted() {
    const { store } = this.getNode()
    this.id = store.data.id
    const nodeData =
      this.id && globalStore.getters['design/getCellById'](this.id)
    nodeData && (this.bxData = nodeData.bxDatas)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
div.enum {
  /deep/ .ant-card.ant-card-small {
    width: 99%;
    margin: 1px auto 0px;
    font-size: 10px;
    background: transparent;
    .ant-card-head {
      background: rgb(254, 133, 79);
      min-height: 8px;
      font-size: 8px;
      .ant-card-head-wrapper {
        .ant-card-head-title {
          padding: 2px 0;
          color: white;
        }
      }
    }
    .ant-card-body {
      padding: 0 4px;
      font-size: 8px;
      min-height: 35px;
    }
  }
}
</style>
