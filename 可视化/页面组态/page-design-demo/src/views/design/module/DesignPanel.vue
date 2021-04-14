<!--
  FilePath: \src\views\design\module\DesignPanel.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 16:12:50
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <div class="form-panel">
    <p class="hint-text" v-show="designData.list.length === 0">
      从左侧选择控件添加
    </p>
    <a-form
      class="a-form-box k-form-build"
      :form="form"
      :layout="designData.config.layout"
      :hideRequiredMark="designData.config.hideRequiredMark"
      :style="designData.config.customStyle"
    >
      <draggable
        tag="div"
        class="draggable-box"
        v-bind="{
          group: 'form-draggable',
          ghostClass: 'moving',
          animation: 180,
          handle: '.drag-move'
        }"
        v-model="designData.list"
        @add="addWidget"
        @start="dragStart($event, designData.list)"
      >
        <transition-group tag="div" name="list" class="list-main">
          <layoutItem
            class="drag-move"
            v-for="record in designData.list"
            :key="record.id"
            :record="record"
            :config="designData.config"
            :selectItem.sync="currentSelectItem"
            :insertAllowedType="insertAllowedType"
            @dragStart="dragStart"
            @handleSelectItem="handleSelectItem"
            @handleCopy="copySelectedWidget"
            @handleDelete="deleteSelectedWidget"
            @handleColAdd="handleColAdd"
          />
        </transition-group>
      </draggable>
    </a-form>
    <!-- 右键菜单 start -->
    <div
      v-show="showRightMenu"
      :style="{ top: menuTop + 'px', left: menuLeft + 'px' }"
      class="right-menu"
    >
      <ul>
        <li @click="handleDownMerge"><a-icon type="caret-down" />向下合并</li>
        <li @click="handleRightMerge"><a-icon type="caret-right" />向右合并</li>
        <li @click="handleAddCol">
          <a-icon type="border-horizontal" />增加一列
        </li>
        <li @click="handleAddRow"><a-icon type="border-verticle" />增加一行</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import layoutItem from './LayoutItem.vue'
export default {
  name: 'KCenter',
  data() {
    return {
      form: this.$form.createForm(this),
      insertAllowedType: [
        'input',
        'textarea',
        'number',
        'select',
        'checkbox',
        'radio',
        'date',
        'time',
        'rate',
        'slider',
        'uploadFile',
        'uploadImg',
        'cascader',
        'treeSelect',
        'switch',
        'text',
        'html'
      ],
      rightMenuSelectValue: {},
      showRightMenu: false,
      menuTop: 0,
      menuLeft: 0,
      trIndex: 0,
      tdIndex: 0
    }
  },
  props: {
    designData: {
      type: Object,
      required: true
    }
  },
  components: {
    draggable,
    layoutItem
  },
  watch: {
    designData: {
      handler(val, old) {
        console.log('data change ----------', val, old)
      },
      deep: true
    }
  },
  computed: {
    ...mapGetters('design', ['currentSelectItem'])
  },
  methods: {
    ...mapActions('design', [
      'upsertWidget',
      'setSelectedWidget',
      'deleteSelectedWidget',
      'copySelectedWidget'
    ]),
    addWidget(evt) {
      const newIndex = evt.newIndex
      this.upsertWidget(this.designData.list[newIndex])
      this.$emit('handleSetSelectItem', this.designData.list[newIndex])
    },
    handleColAdd(evt, columns, isCopy = false) {
      // 重置或者生成key值
      const newIndex = evt.newIndex
      const key = columns[newIndex].type + '_' + new Date().getTime()
      if (columns[newIndex].id === '' || isCopy) {
        this.$set(columns, newIndex, {
          ...columns[newIndex],
          key,
          model: key
        })
        if (typeof columns[newIndex].options !== 'undefined') {
          // 深拷贝options
          const optionsStr = JSON.stringify(columns[newIndex].options)
          columns[newIndex].options = JSON.parse(optionsStr)
        }
        if (typeof columns[newIndex].rules !== 'undefined') {
          // 深拷贝rules
          const rulesStr = JSON.stringify(columns[newIndex].rules)
          columns[newIndex].rules = JSON.parse(rulesStr)
        }
        if (typeof columns[newIndex].list !== 'undefined') {
          // 深拷贝list
          columns[newIndex].list = []
        }
        if (typeof columns[newIndex].columns !== 'undefined') {
          // 深拷贝columns
          const columnsStr = JSON.stringify(columns[newIndex].columns)
          columns[newIndex].columns = JSON.parse(columnsStr)
          // 复制时，清空数据
          columns[newIndex].columns.forEach(item => {
            item.list = []
          })
        }
        if (columns[newIndex].type === 'table') {
          // 深拷贝trs
          const trsStr = JSON.stringify(columns[newIndex].trs)
          columns[newIndex].trs = JSON.parse(trsStr)
          // 复制时，清空数据
          columns[newIndex].trs.forEach(item => {
            item.tds.forEach(val => {
              val.list = []
            })
          })
        }
      }
      // 深拷贝数据
      const listString = JSON.stringify(columns[newIndex])
      columns[newIndex] = JSON.parse(listString)
      this.$emit('handleSetSelectItem', columns[newIndex])
    },
    dragStart(evt, list) {
      // 拖拽结束,自动选择拖拽的控件项
      this.$emit('handleSetSelectItem', list[evt.oldIndex])
    },
    handleSelectItem(record) {
      // 修改选择Item
      this.setSelectedWidget(record)
    },
    handleDownMerge() {
      // 向下合并
      if (
        this.rightMenuSelectValue.trs.length -
          this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
            .rowspan <=
        this.trIndex
      ) {
        this.$message.error('当前是最后一行，无法向下合并')
        return false
      }

      // 计算rowspan超过自身的td
      let rows = 0
      this.rightMenuSelectValue.trs[this.trIndex].tds.forEach(
        (element, index) => {
          if (index >= this.tdIndex) {
            return false
          }
          if (
            element.rowspan >
            this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
              .rowspan
          ) {
            rows += 1
          }
        }
      )
      if (
        this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
          .colspan !==
        this.rightMenuSelectValue.trs[this.trIndex + 1].tds[this.tdIndex - rows]
          .colspan
      ) {
        this.$message.error('当前表格无法向下合并')
        return false
      }

      this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex].rowspan += 1
      this.rightMenuSelectValue.trs[
        this.trIndex + 1
      ].tds = this.rightMenuSelectValue.trs[this.trIndex + 1].tds.filter(
        (item, index) => index !== this.tdIndex - rows
      )

      // }
    },
    handleRightMerge() {
      // 向右合并
      const sumCols = this.rightMenuSelectValue.trs[this.trIndex].tds
        .map(item => item.colspan)
        .reduce(function (partial, value) {
          return partial + value
        })
      if (
        sumCols -
          this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
            .colspan <=
        this.tdIndex
      ) {
        this.$message.error('当前是最后一列，无法向右合并')
        return false
      }
      if (
        this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex]
          .rowspan !==
        this.rightMenuSelectValue.trs[this.trIndex].tds[this.tdIndex + 1]
          .rowspan
      ) {
        this.$message.error('当前表格无法向右合并')
        return false
      }

      this.rightMenuSelectValue.trs[this.trIndex].tds[
        this.tdIndex
      ].colspan += this.rightMenuSelectValue.trs[this.trIndex].tds[
        this.tdIndex + 1
      ].colspan

      this.rightMenuSelectValue.trs[
        this.trIndex
      ].tds = this.rightMenuSelectValue.trs[this.trIndex].tds.filter(
        (item, index) => {
          return index !== this.tdIndex + 1
        }
      )
      // }
    },
    handleAddCol() {
      // 增加列
      this.rightMenuSelectValue.trs.forEach(item => {
        item.tds.splice(this.tdIndex + 1, 0, {
          colspan: 1,
          rowspan: 1,
          list: []
        })
      })
    },
    handleAddRow() {
      // 增加行
      // 获取总col值
      const sumCols = this.rightMenuSelectValue.trs[0].tds
        .map(item => item.colspan)
        .reduce(function (partial, value) {
          return partial + value
        })
      const rowJson = { tds: [] }
      for (let i = 0; i < sumCols; i++) {
        rowJson.tds.push({
          colspan: 1,
          rowspan: 1,
          list: []
        })
      }
      this.rightMenuSelectValue.trs.splice(this.trIndex + 1, 0, rowJson)
    }
  }
}
</script>
