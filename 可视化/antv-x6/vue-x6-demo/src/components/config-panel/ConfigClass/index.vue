<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="实体类配置" key="1">
      <a-row align="middle">
        <a-col :span="6">名称</a-col>
        <a-col :span="18">
          <a-input v-model="name" style="width: 100%" @change="changeName()" />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="6">类型</a-col>
        <a-col :span="18">
          <a-select
            default-value="Class"
            v-model="type"
            style="width: 100%"
            @change="handleChangeType"
          >
            <a-select-option value="class"> 类 </a-select-option>
            <a-select-option value="interface"> 接口 </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="6">属性</a-col>
        <a-col :span="8">
          <a-button @click="showFiledManager" type="primary">属性管理</a-button>
          <FieldManager
            v-bind="fieldOp"
            v-if="fieldOp.show"
            @ok="fieldManagerOk"
            @cancel="fieldManagerCancel"
          ></FieldManager>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">操作</a-col>
        <a-col :span="8">
          <a-button type="primary" ghost>保存</a-button>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import FieldManager from './FieldManager'

export default {
  name: 'ConfigClass',
  components: {
    FieldManager
  },
  props: {
    id: String,
    cellData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      scaleTypes: [],
      name: '',
      type: '',
      fieldOp: {
        show: false,
        fields: []
      }
    }
  },
  mounted() {
    this.init(this.cellData)
  },
  watch: {
    id() {
      this.init(this.cellData)
    }
  },
  methods: {
    init(cellData) {
      this.name = cellData.bxDatas.modelName
      this.fieldOp.fields = cellData.bxDatas.fieldsList
      this.fieldOp.fieldTypes =
        this?.$store?.getters['design/fieldTypes']() || []
      this.type = cellData.cellType
    },
    fieldManagerOk(fields) {
      this.fieldOp.show = false
      this.cellData.bxDatas.fieldsList = fields
      this.updateCell(this.cellData)
    },
    fieldManagerCancel() {
      this.fieldOp.show = false
    },
    showFiledManager() {
      this.fieldOp.show = true
    },
    updateCell() {
      this.$store.dispatch('design/updateCellById', this.cellData)
    },
    handleChangeType() {
      this.cellData.cellType = this.type

      this.updateCell(this.cellData)
    },
    changeName() {
      this.cellData.bxDatas.modelName = this.name
      this.updateCell(this.cellData)
    }
  }
}
</script>

<style lang="less" scoped></style>
