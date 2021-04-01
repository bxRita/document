<template>
  <div class="enum">
    <a-card :title="bxData.name" :bordered="false" size="small">
      <B v-for="i in bxData.fields" :key="i">{{ i }}&nbsp;&nbsp;，</B>
    </a-card>
  </div>
</template>

<script>
import globalStore from '@/store'

// 组件默认展示值
const DEFAULT = { name: '枚举', fields: ['Y', 'N'] }

export default {
  name: 'GqlEnum',
  inheritAttrs: false,
  inject: ['getGraph', 'getNode'],
  components: {},
  data() {
    return {
      id: null
    }
  },
  computed: {
    nodeData() {
      return (
        globalStore.getters['design/getCellById'](this.id) || {
          bxDatas: DEFAULT
        }
      )
    },
    bxData() {
      return this.nodeData.bxDatas || DEFAULT
    }
  },
  created() {},
  mounted() {
    const { store } = this.getNode()
    this.id = store.data.id
    console.log('enum', store.data)
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
