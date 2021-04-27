<template>
  <div class="enum">
    <a-card :title="title" :bordered="false" size="small">
      <a-list item-layout="horizontal" :data-source="bxData.fieldsList">
        <a-list-item slot="renderItem" slot-scope="item">
          <b>{{ item.fieldName }}</b>
          <span slot="actions">{{ item.fieldType }}</span>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import globalStore from '@/store'
// 组件默认展示值
const DEFAULT = {
  modelName: '实体类',
  modelType: 'Class',
  fieldsList: [
    {
      fieldType: 'String',
      fieldName: 'id',
      fieldIsNull: false,
      defaultValue: '',
      primaryType: '2'
    }
  ]
}
export default {
  name: 'GqlClass',
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
    },
    title() {
      return this.bxData.modelName
    }
  },
  created() {},
  mounted() {
    const { store } = this.getNode()
    this.id = store.data.id
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
      background: rgb(95, 149, 255);
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
      .ant-list-item {
        padding: 1px 0;
        .ant-list-item-action {
          margin: 0 5px 0 0;
          li {
            color: black;
          }
        }
      }
    }
  }
}
</style>
