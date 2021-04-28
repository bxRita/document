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
          <a-button type="primary" ghost @click="saveModel">保存</a-button>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { Shape } from '@antv/x6'
import FieldManager from './FieldManager'
import { cloneDeep } from 'lodash'
import { getCurrentGraph } from '@/utils/graphUtil'
import { DICTIONARY_TYPE, X6CellType } from '@/config'
import { getSysDictField } from '@/api/system'
import { getEdgeCommonCfg } from '@/components/nodes'
import SaveMixins from '../saveMixins'
export default {
  name: 'ConfigClass',
  components: {
    FieldManager
  },
  mixins: [SaveMixins],
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
      graph: getCurrentGraph(),
      scaleTypes: [],
      name: '',
      type: '',
      fieldOp: {
        basisTypes: [],
        foreignTypes: [],
        show: false,
        fields: []
      }
    }
  },
  async mounted() {
    this.init(this.cellData)
  },
  watch: {
    id() {
      this.init(this.cellData)
    }
  },
  methods: {
    async init(cellData) {
      this.name = cellData.bxDatas.modelName
      this.fieldOp.fields = cellData.bxDatas.fieldsList
      this.fieldOp.fieldTypes =
        cloneDeep(this?.$store?.getters['design/fieldTypes']()) || []
      this.type = cellData.cellType

      this.fieldOp.basisTypes = await getSysDictField(
        DICTIONARY_TYPE.BASE_FIELD_TYPE
      )
      this.fieldOp.foreignTypes = await getSysDictField(
        DICTIONARY_TYPE.BASE_MODELREL_TYPE
      )
    },
    /**
     * @description 属性管理界面  点击确认 回调方法
     */
    fieldManagerOk(fields) {
      this.fieldOp.show = false
      this.handlerEdgeConnect(
        cloneDeep(this.cellData.bxDatas.fieldsList),
        fields
      )
      this.cellData.bxDatas.fieldsList = fields
      this.updateCell(this.cellData)
    },
    /**
     * @description 判断是否是 基本类型
     */
    checkIsBasicType(type) {
      return this.fieldOp.basisTypes.findIndex(item => item.code === type) > -1
    },
    /**
     * @description 根据属性字段对比 重新建立关联关系
     */
    handlerEdgeConnect(preFields, newFields) {
      let toDel = [],
        toAdd = []
      const preLen = preFields.length,
        newLen = newFields.length
      // 找出被删除的关联关系
      for (let i = 0; i < preLen; i++) {
        let temp = preFields[i],
          oldIsBasic = this.checkIsBasicType(temp.fieldType)
        let newItem = newFields.find(item => item.fieldName === temp.fieldName)
        // 删除关联关系 需要满足：
        // 旧字段中 有关联关系
        // 新字段 1：已删除   2、已更新为其它类型
        if (!oldIsBasic && (!newItem || newItem.fieldType !== temp.fieldType)) {
          toDel.push(temp)
        }
      }
      // 找出 新增的关联关系
      for (let i = 0; i < newLen; i++) {
        let temp = newFields[i],
          newIsBasic = this.checkIsBasicType(temp.fieldType)

        let oldItem = preFields.find(item => item.fieldName === temp.fieldName)
        // 新增关联关系 需要满足：
        // 新字段 类型不是基本类型 有关联关系
        // 旧列表  1. 没有这个字段  2. 有这个字段 但是 类型不一样
        if (!newIsBasic && (!oldItem || oldItem.fieldType !== temp.fieldType)) {
          toAdd.push(temp)
        }
      }
      console.log('toDel: ', toDel)
      console.log('toAdd: ', toAdd)
      // 在画布上增加连线
      const addLen = toAdd.length
      if (addLen) {
        for (let i = 0; i < addLen; i++) {
          let temp = toAdd[i],
            foreignKeyType = temp?.foreignRela?.foreignKeyType
          const forKeyDetail =
            foreignKeyType &&
            this.fieldOp.foreignTypes.find(item => item.code === foreignKeyType)

          let fieldType = temp.fieldType,
            target = this.getTargetIdByModelName(fieldType)
          if (!target) continue

          let edgeCfg = getEdgeCommonCfg(
            {
              // 线条基本信息配置
              sourceId: this.id,
              targetId: target.id,
              labelText: forKeyDetail?.name || '',
              sourcePort: this.cellData.ports.items[1].id,
              targetPort: target.ports.items[3].id
            },
            {
              // 其它配置信息

              bxDatas: {
                refTableId: this.id,
                resourceField: temp.fieldName, // 连线关联的是源表 的 哪个属性
                targetField: temp?.foreignRela?.to,
                relType: foreignKeyType
              }
            }
          )
          temp.extends = cloneDeep(edgeCfg)
          let edge = new Shape.Edge(edgeCfg)

          this.graph.addEdge(edge)
        }
      }
      // 在画布上删除连线
      const delLen = toDel.length
      if (delLen) {
        for (let i = 0; i < delLen; i++) {
          let temp = toDel[i]
          let fieldType = temp.fieldType,
            target = this.getTargetIdByModelName(fieldType)
          let curEdge = this.getEdgeBySourceAndTarget(this.id, target.id)
          curEdge && this.graph.removeEdge(curEdge.id)

          temp.extends = null
        }
      }
    },
    /**
     * @description 根据源节点和目标节点获取 连线信息
     */
    getEdgeBySourceAndTarget(sourceId, targetId) {
      let cellObj = this.graph.toJSON(),
        cells = cellObj.cells,
        edges = cells.filter(item => item.shape === X6CellType.edge)

      return edges.find(
        item => item.source.cell === sourceId && item.target.cell === targetId
      )
    },
    /**
     * @description 根据模型名称 获取当前模型所属组件的id
     */
    getTargetIdByModelName(modelName) {
      let cellObj = this.graph.toJSON(),
        cells = cellObj.cells
      let temp = cells.find(item => item?.bxDatas?.modelName === modelName)
      return temp || null
    },
    /**
     * @description 属性管理界面  点击取消 回调方法
     */
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
