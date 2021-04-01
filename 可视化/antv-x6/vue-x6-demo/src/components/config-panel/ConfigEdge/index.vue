<template>
  <a-tabs defaultActiveKey="1">
    <a-tab-pane tab="线条" key="1">
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
      <a-row align="middle">
        <a-col :span="8">Label</a-col>
        <a-col :span="14">
          <a-input
            :value="globalGridAttr.label"
            style="width: 100%"
            @change="onLabelChange"
          />
        </a-col>
      </a-row>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
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
      curCell: ''
    }
  },
  computed: {
    edgeIdCpt() {
      return {
        id: this.id
      }
    }
  },
  watch: {
    edgeIdCpt: {
      handler(nv) {
        const graph = getCurrentGraph()

        const cell = graph.getCellById(nv.id)
        if (!cell || !cell.isEdge()) {
          return
        }
        this.curCell = cell
        const connector = cell.getConnector() || {
          name: 'normal'
        }
        this.globalGridAttr.stroke = cell.attr('line/stroke')
        this.globalGridAttr.strokeWidth = cell.attr('line/strokeWidth')
        this.globalGridAttr.connector = connector.name
        this.globalGridAttr.label = cell.getLabels()[0]?.attrs.text.text || ''
      },
      immediate: false,
      deep: false
    }
  },
  methods: {
    onStrokeWidthChange(val) {
      this.globalGridAttr.strokeWidth = val
      this.curCell.attr('line/strokeWidth', val)
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
    onLabelChange(e) {
      const val = e.target.value
      this.globalGridAttr.label = val
      this.curCell.setLabels([
        {
          attrs: {
            text: {
              text: val
            }
          },
          position: {
            distance: 0.5
          }
        }
      ])
      // curCell.appendLabel({
      //   attrs: {
      //     text: {
      //       text: val,
      //     },
      //   },
      //   position: {
      //     distance: 0.25,
      //   },
      // })
    }
  }
}
</script>

<style lang="less" scoped></style>
