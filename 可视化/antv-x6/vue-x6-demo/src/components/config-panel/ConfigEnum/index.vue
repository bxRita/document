<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="属性" key="1">
      <a-row align="middle">
        <a-col :span="6">枚举名</a-col>
        <a-col :span="18">
          <a-input
            v-model="name"
            size="small"
            style="width: 100%"
            @change="changeName()"
          />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="6">枚举值</a-col>
        <a-col :span="18">
          <a-row v-for="(ev, idx) in lists" :key="idx" dense>
            <a-col :span="22">
              <a-input
                style="width: 90%"
                :value="ev.fieldName"
                size="small"
                @change="changeField(idx, $event)"
              />
            </a-col>
            <a-col :span="2">
              <a-popconfirm
                title="确认要删除?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirmDelete(idx)"
              >
                <a-icon type="delete"></a-icon>
              </a-popconfirm>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="6"></a-col>
        <a-col :span="15">
          <a-button block @click="add" type="primary" ghost>
            <a-icon type="plus" /> 添加枚举值
          </a-button>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">操作</a-col>
        <a-col :span="8">
          <a-button type="primary" ghost @click="saveModel">保存</a-button>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import SaveMixins from '../saveMixins'
export default {
  name: 'ConfigEnum',
  props: {
    id: String,
    cellData: {
      type: Object,
      default: () => {
        return {
          name: '',
          fields: []
        }
      }
    }
  },
  mixins: [SaveMixins],
  data() {
    return {
      name: '',
      lists: [],
      timer: null
    }
  },
  computed: {},
  watch: {
    id() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.name = this.cellData.bxDatas.modelName
      this.lists = this.cellData.bxDatas.fieldsList
    },
    confirmDelete(idx) {
      let item = this.cellData.bxDatas.fieldsList.splice(idx, 1)

      // 数据更新
      this.updateCell(this.cellData)
    },
    add() {
      this.lists.push({ fieldName: '', primaryType: '0', fieldType: 'String' })
    },
    // 更新store中节点数据
    updateCell() {
      this.$store.dispatch('design/updateCellById', this.cellData)
    },
    /**
     * @description 修改名称事件
     */
    changeName() {
      this.cellData.bxDatas.modelName = this.name
      this.updateCell(this.cellData)
    },
    /**
     * @description 修改枚举属性
     */
    changeField(idx, e) {
      if (this.timer) clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        if (!this.cellData.bxDatas.fieldsList) {
          this.cellData.bxDatas.fieldsList = []
        }
        let item = this.cellData.bxDatas.fieldsList[parseInt(idx)]
        item.fieldName = e.target.value

        // 数据更新
        this.updateCell(this.cellData)
      }, 500)
    }
  }
}
</script>

<style lang="less" scoped>
::v-deep .ant-tabs-tabpane {
  .ant-row {
    .ant-col {
      .ant-row {
        margin: 0;
      }
    }
  }
}
</style>
