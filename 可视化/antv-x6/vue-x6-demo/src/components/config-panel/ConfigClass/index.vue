<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="节点" key="1">
      <a-row align="middle">
        <a-col :span="8">Border Color</a-col>
        <a-col :span="16">
          <a-input
            type="color"
            :value="globalGridAttr.nodeStroke"
            style="width: 100%"
            @change="onStrokeChange"
          />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Border Width</a-col>
        <a-col :span="12">
          <a-slider
            :min="1"
            :max="5"
            :step="1"
            :value="globalGridAttr.nodeStrokeWidth"
            @change="onStrokeWidthChange"
          />
        </a-col>
        <a-col :span="2">
          <div class="result">{{ globalGridAttr.nodeStrokeWidth }}</div>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Fill</a-col>
        <a-col :span="16">
          <a-input
            type="color"
            :value="globalGridAttr.nodeFill"
            style="width: 100%"
            @change="onFillChange"
          />
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane tab="文本" key="2">
      <a-row align="middle">
        <a-col :span="8">Font Size</a-col>
        <a-col :span="12">
          <a-slider
            :min="8"
            :max="16"
            :step="1"
            :value="globalGridAttr.nodeFontSize"
            @change="onFontSizeChange"
          />
        </a-col>
        <a-col :span="2">
          <div class="result">{{ globalGridAttr.nodeFontSize }}</div>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">Font Color</a-col>
        <a-col :span="16">
          <a-input
            type="color"
            :value="globalGridAttr.nodeColor"
            style="width: 100%"
            @change="onColorChange"
          />
        </a-col>
      </a-row>
    </a-tab-pane>
    <a-tab-pane tab="属性" key="3">
      <a-row align="middle">
        <a-col :span="8">类/接口名</a-col>
        <a-col :span="16">
          <a-input v-model="name" style="width: 100%" @change="changeName()" />
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">类型</a-col>
        <a-col :span="16">
          <a-select
            default-value="Class"
            v-model="type"
            style="width: 100%"
            @change="handleChangeType"
          >
            <a-select-option value="Class"> 类 </a-select-option>
            <a-select-option value="Interface"> 接口 </a-select-option>
          </a-select>
        </a-col>
      </a-row>
      <a-row align="middle">
        <a-col :span="8">属性</a-col>
        <a-col :span="16">
          <a-row>
            <a-col :span="11"> 名称 </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12"> 类型 </a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field1"
                style="width: 100%"
                @change="changeField(1)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">
              <a-select default-value="String" style="width: 100%">
                <a-select-option value="String"> String </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field2"
                style="width: 100%"
                @change="changeField(2)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field3"
                style="width: 100%"
                @change="changeField(3)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field4"
                style="width: 100%"
                @change="changeField(4)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field5"
                style="width: 100%"
                @change="changeField(5)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field6"
                style="width: 100%"
                @change="changeField(6)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field7"
                style="width: 100%"
                @change="changeField(7)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field8"
                style="width: 100%"
                @change="changeField(8)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
          <a-row>
            <a-col :span="11">
              <a-input
                v-model="attr.field9"
                style="width: 100%"
                @change="changeField(9)"
              />
            </a-col>
            <a-col :span="1"></a-col>
            <a-col :span="12">String</a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import { nodeOpt } from './method'

export default {
  name: 'Class',
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
    },
    // {name: '', fields: []}
    cellData: {
      type: Object,
      default: () => {
        return {
          type: '',
          name: '',
          fields: []
        }
      }
    }
  },
  data() {
    return {
      name: '',
      type: '',
      curCel: '',
      attr: {
        field1: '',
        field2: '',
        field3: '',
        field4: '',
        field5: '',
        field6: '',
        field7: '',
        field8: '',
        field9: ''
      }
    }
  },
  computed: {
    nodeIdCpt() {
      return {
        id: this.id
      }
    }
  },
  watch: {
    nodeIdCpt: {
      handler(nv) {
        this.curCel = nodeOpt(nv, this.globalGridAttr)
      },
      immediate: false,
      deep: false
    }
  },
  methods: {
    updateCell() {
      this.$store.dispatch('design/updateCellById', this.cellData)
    },
    handleChangeType() {
      this.cellData.bxDatas.type = this.type

      this.updateCell(this.cellData)
    },
    changeName() {
      this.cellData.bxDatas.name = this.name
      this.updateCell(this.cellData)
    },
    changeField(idx) {
      if (!this.cellData.bxDatas.fields) {
        this.cellData.bxDatas.fields = []
      }
      this.cellData.bxDatas.fields.splice(parseInt(idx) - 1, 1, {
        name: this.attr[`field${idx}`],
        type: parseInt(Math.random() * 10) / 2 === 0 ? 'String' : 'Boolean'
      })
    },
    onStrokeChange(e) {
      const val = e.target.value
      this.globalGridAttr.nodeStroke = val
      this.curCel.attr('body/stroke', val)
    },
    onStrokeWidthChange(val) {
      this.globalGridAttr.nodeStrokeWidth = val
      this.curCel.attr('body/strokeWidth', val)
    },
    onFillChange(e) {
      const val = e.target.value
      this.globalGridAttr.nodeFill = val
      this.curCel.attr('body/fill', val)
    },
    onFontSizeChange(val) {
      this.globalGridAttr.nodeFontSize = val
      this.curCel.attr('text/fontSize', val)
    },
    onColorChange(e) {
      const val = e.target.value
      this.globalGridAttr.nodeColor = val
      this.curCel.attr('text/fill', val)
    },
    onUsersChange(e) {
      const val = e.target.value
      this.globalGridAttr.nodeUsers = val
      this.curCel.attr('approve/users', val)
    }
  }
}
</script>

<style lang="less" scoped></style>
