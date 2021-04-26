<!--
  FilePath: \src\components\Toolbar.vue
  Project: vue-x6-demo
  CreatedAt: 2021-04-01 10:02:26
  CreatedBy: bx (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div class="bar">
    <a-tooltip placement="bottom">
      <template #title>
        <span>清除 (Cmd + D)</span>
      </template>
      <a-button
        name="delete"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="delete"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>撤销 (Cmd + Z)</span>
      </template>
      <a-button
        :disabled="!canUndo"
        name="undo"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="undo"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>Redo (Cmd + Shift + Z)</span>
      </template>
      <a-button
        :disabled="!canRedo"
        name="redo"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="redo"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>复制 (Cmd + Shift + Z)</span>
      </template>
      <a-button
        name="copy"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="copy"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>剪切 (Cmd + X)</span>
      </template>
      <a-button
        name="cut"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="scissor"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>粘贴 (Cmd + V)</span>
      </template>
      <a-button
        name="paste"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="snippets"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>保存PNG (Cmd + S)</span>
      </template>
      <a-button
        name="savePNG"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="download"
      >
        png
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>保存SVG (Cmd + S)</span>
      </template>
      <a-button
        name="saveSVG"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="download"
      >
        svg
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>打印 (Cmd + P)</span>
      </template>
      <a-button
        name="print"
        @click="handleClick"
        class="item-space"
        size="small"
        icon="printer"
      >
      </a-button>
    </a-tooltip>

    <a-tooltip placement="bottom">
      <template #title>
        <span>导出 (Cmd + P)</span>
      </template>
      <a-button
        name="toJSON"
        @click="handleClick"
        class="item-space"
        size="small"
      >
        toJSON
      </a-button>
    </a-tooltip>
  </div>
</template>

<script>
import { getCurrentGraph } from '@/utils/graphUtil'
import { DataUri } from '@antv/x6'

export default {
  name: 'Index',
  components: {},
  data() {
    return {
      canUndo: '',
      canRedo: '',
      graph: getCurrentGraph()
    }
  },
  mounted() {
    setTimeout(() => {
      this.initEvent()
    }, 200)
  },
  methods: {
    initEvent() {
      const { history } = this.graph
      history.on('change', () => {
        this.canUndo = history.canUndo()
        this.canRedo = history.canRedo()
      })
      this.graph.bindKey('ctrl+z', () => {
        if (history.canUndo()) {
          history.undo()
        }
        return false
      })
      this.graph.bindKey('ctrl+shift+z', () => {
        if (history.canRedo()) {
          history.redo()
        }
        return false
      })
      this.graph.bindKey('ctrl+d', () => {
        this.graph.clearCells()
        return false
      })
      this.graph.bindKey('ctrl+s', () => {
        this.graph.toPNG(datauri => {
          DataUri.downloadDataUri(datauri, 'chart.png')
        })
        return false
      })
      this.graph.bindKey('ctrl+p', () => {
        this.graph.printPreview()
        return false
      })
      this.graph.bindKey('ctrl+c', this.copy)
      this.graph.bindKey('ctrl+v', this.paste)
      this.graph.bindKey('ctrl+x', this.cut)
    },
    copy() {
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.copy(cells)
      }
      return false
    },
    cut() {
      const cells = this.graph.getSelectedCells()
      if (cells.length) {
        this.graph.cut(cells)
      }
      return false
    },
    paste() {
      if (!this.graph.isClipboardEmpty()) {
        const cells = this.graph.paste({ offset: 32 })
        this.graph.cleanSelection()
        this.graph.select(cells)
      }
      return false
    },
    handleClick(event) {
      const name = event.currentTarget.name
      switch (name) {
        case 'undo':
          this.graph.history.undo()
          this.$emit('change')
          break
        case 'redo':
          this.graph.history.redo()
          this.$emit('change')
          break
        case 'delete':
          this.graph.clearCells()
          this.$emit('change')
          break
        case 'savePNG':
          this.graph.toPNG(
            dataUri => {
              // 下载
              DataUri.downloadDataUri(dataUri, 'chartx.png')
            },
            {
              backgroundColor: 'white',
              padding: {
                top: 20,
                right: 30,
                bottom: 40,
                left: 50
              },
              quality: 1
            }
          )
          break
        case 'saveSVG':
          this.graph.toSVG(dataUri => {
            // 下载
            DataUri.downloadDataUri(DataUri.svgToDataUrl(dataUri), 'chart.svg')
          })
          break
        case 'print':
          this.graph.printPreview()
          break
        case 'copy':
          this.copy()
          this.$emit('change')
          break
        case 'cut':
          this.cut()
          this.$emit('change')
          break
        case 'paste':
          this.paste()
          this.$emit('change')
          break
        case 'toJSON':
          console.log(this.graph.toJSON())
          localStorage.setItem(
            'GRAPH_DATA_ITEM',
            JSON.stringify(this.graph.toJSON())
          )
          // graph.fromJSON({cells:[graph.toJSON().cells[0],graph.toJSON().cells[1]]})
          break
        default:
          break
      }
      this.$emit('change')
    }
  }
}
</script>

<style lang="less" scoped>
button {
  margin-right: 8px;
}
.bar {
  margin-left: 16px;
  margin-right: 16px;
}
.item-space {
  //margin-left:16px;
}
</style>
