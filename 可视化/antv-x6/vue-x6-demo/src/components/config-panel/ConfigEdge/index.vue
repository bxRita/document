<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="关联关系配置" key="1">
      <a-row>
        <a-col><b>基本信息</b></a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">源表属性</a-col>
        <a-col :span="14">
          <a-select
            v-model="cellModel.resourceField"
            style="width: 100%"
            @change="changeResource"
            disabled
          >
            <a-select-option
              :key="idx"
              v-for="(field, idx) in resourceFields"
              :value="field.fieldName || field"
              >{{ field.fieldName || field }}</a-select-option
            >
          </a-select>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">目标字段</a-col>
        <a-col :span="14">
          <a-select
            v-model="cellModel.targetField"
            style="width: 100%"
            @change="changeTarget"
          >
            <a-select-option
              :key="idx"
              v-for="(field, idx) in targetFields"
              :value="field.fieldName || field"
              >{{ field.fieldName || field }}</a-select-option
            >
          </a-select>
        </a-col>
      </a-row>

      <a-row align="middle">
        <a-col :span="8">关联类型</a-col>
        <a-col :span="14">
          <a-select
            v-model="cellModel.relType"
            placeholder="请选择"
            style="width: 100%"
            @change="onRelType"
          >
            <a-select-option
              :value="item.code"
              :key="idx"
              v-for="(item, idx) in relTypes"
              >{{ item.name }}</a-select-option
            >
          </a-select>
        </a-col>
      </a-row>

      <a-row>
        <a-col><b>线条设置</b></a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Width</a-col>
        <a-col :span="12">
          <a-slider
            :min="1"
            :max="5"
            :step="1"
            :value="globalGridAttr.strokeWidth"
            @change="onStrokeWidthChange"
          />
        </a-col>
        <a-col :span="2">
          <div class="result">{{ globalGridAttr.strokeWidth }}</div>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Color</a-col>
        <a-col :span="14">
          <a-input
            type="color"
            :value="globalGridAttr.stroke"
            style="width: 100%"
            @change="onStrokeChange"
          />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Connector</a-col>
        <a-col :span="14">
          <a-select
            style="width: 100%"
            :value="globalGridAttr.connector"
            @change="onConnectorChange"
          >
            <a-select-option value="normal">Normal</a-select-option>
            <a-select-option value="smooth">Smooth</a-select-option>
            <a-select-option value="rounded">Rounded</a-select-option>
            <a-select-option value="jumpover">Jumpover</a-select-option>
          </a-select>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { mapActions } from 'vuex'
import { DICTIONARY_TYPE } from '@/config'
import { getSysDictField } from '@/api/system'

import { getCurrentGraph } from '@/utils/graphUtil'
export default {
  name: 'Index',
  props: {
    globalGridAttr: {
      type: Object,
      default: null,
      require: true
    },
    id: {
      type: String,
      default: null,
      require: true
    }
  },
  data() {
    return {
      cellModel: {
        resourceField: '',
        targetField: '',
        relType: ''
      },
      resourceFields: [],
      targetFields: [],
      curCell: '',
      graph: null,
      relTypes: []
    }
  },
  watch: {
    id(newVal) {
      if (!newVal) return
      const cell = this.graph.getCellById(newVal)
      console.log('newVal:', newVal, cell)
      if (!cell || !cell.isEdge()) {
        return
      }
      this.init(newVal)
      this.cellModel = Object.assign(
        {},
        this.cellModel,
        this.curCell.store.data?.bxDatas
      )
      console.log('edgeModel:', this.cellModel)
      const connector = cell.getConnector() || {
        name: 'normal'
      }
      this.globalGridAttr.stroke = cell.attr('line/stroke')
      this.globalGridAttr.strokeWidth = cell.attr('line/strokeWidth')
      this.globalGridAttr.connector = connector.name
      this.globalGridAttr.label = cell.getLabels()[0]?.attrs?.text?.text || ''
    }
  },
  mounted() {
    this.graph = getCurrentGraph()
    this.init(this.id)
  },
  methods: {
    ...mapActions('design', ['updateCellById', 'updateRelateNodeCell']),
    async init(cellId) {
      this.curCell = this.graph.getCellById(cellId)
      this.cellModel = Object.assign(
        {},
        this.cellModel,
        this.curCell.store.data?.bxDatas
      )
      this.getFromTofields(this.curCell)
      // 外键关联类型
      this.relTypes = await getSysDictField(DICTIONARY_TYPE.BASE_MODELREL_TYPE)
    },
    updateCell() {
      this.updateCellById(this.curCell)
      // 更新连线所在节点的相关数据
      this.updateRelateNodeCell(this.curCell.store.data?.bxDatas)
    },
    onStrokeWidthChange(val) {
      this.globalGridAttr.strokeWidth = val
      this.curCell.attr('line/strokeWidth', val)
    },
    /**
     * @description 获取 起始，结束 表 的 关联字段
     */
    getFromTofields(curCell) {
      let nodeData = curCell.store.data
      const { source, target } = nodeData
      let sid = source.cell,
        tid = target.cell
      const sourceNode = this.graph.getCellById(sid)
      const targetNode = this.graph.getCellById(tid)

      this.resourceFields = sourceNode?.store.data?.bxDatas?.fieldsList
      this.targetFields = targetNode?.store.data?.bxDatas?.fieldsList
    },
    onStrokeChange(e) {
      const val = e.target.value
      this.globalGridAttr.stroke = val
      this.curCell.attr('line/stroke', val)
    },
    onConnectorChange(val) {
      this.globalGridAttr.connector = val
      this.curCell.setConnector(val)
    },
    setFieldVal(fieldName, val) {
      let bxDatas = this.curCell.store.data.bxDatas

      bxDatas[fieldName] = val
    },
    /**
     * @description 切换源表字段
     */
    changeResource(v) {
      this.setFieldVal('resourceField', v)

      this.updateCell()
    },
    /**
     * @description 切换目标表字段
     */
    changeTarget(v) {
      this.setFieldVal('targetField', v)

      this.updateCell()
    },
    onRelType(val) {
      this.setFieldVal('relType', val)

      let item = this.relTypes.find(item => item.value === val)
      if (item) {
        const label = item.label
        this.globalGridAttr.label = label
        this.curCell.appendLabel(label)
      }
      this.updateCell()
    }
  }
}
</script>

<style lang="less" scoped></style>
