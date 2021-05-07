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
        @end="dragEnd($event, designData.list)"
      >
        <transition-group tag="div" name="list" class="list-main">
          <layoutItem
            class="drag-move"
            v-for="record in designData.list"
            :key="record.id"
            :record="record"
            :config="designData.config"
            :selectItem.sync="currentSelectItem"
            @dragStart="dragStart"
            @dragEnd="dragEnd"
            @handleSelectItem="handleSelectItem"
            @handleCopy="copySelectedWidget"
            @handleDelete="deleteSelectedWidget"
            @handleColAdd="handleColAdd"
            @addSubWidget="addSubWidget"
          />
        </transition-group>
      </draggable>
    </a-form>
  </div>
</template>
<script>
import { cloneDeep } from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import layoutItem from './LayoutItem.vue'
import { generateId } from '@/utils/tools'
export default {
  name: 'DesignPanel',
  inheritAttrs: false,
  data() {
    return {}
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
        val != old && console.log('designData change ----------', val, old)
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
      'copySelectedWidget',
      'addSubWidgetToLayout',
      'updateSubWidgetToLayout'
    ]),
    addSubWidget(evt, list, curLayoutWidget, idxObj) {
      const newIndex = evt.newIndex
      let newWidget = list[newIndex] // 当前新增的组件信息
      newWidget.id = generateId(newWidget.key)
      this.addSubWidgetToLayout({
        parentWidget: curLayoutWidget,
        toAddWidget: cloneDeep(newWidget),
        idxObj,
        widgetIdx: newIndex
      })
    },
    addWidget(evt) {
      const newIndex = evt.newIndex
      let newWidget = this.designData.list[newIndex]
      newWidget.id = generateId(newWidget.key)

      this.upsertWidget(cloneDeep(newWidget))

      this.$emit('handleSetSelectItem', this.designData.list[newIndex])
    },
    handleColAdd(evt, columns, isCopy = false) {},
    dragEnd(evt, list, curLayoutWidget, idxObj) {
      console.log('dragEnd: ', arguments)
      this.updateSubWidgetToLayout({
        parentWidget: curLayoutWidget,
        idxObj,
        newList: list
      })
    },
    dragStart(evt, list, curLayoutWidget) {
      console.log('dragStart: ', arguments)
      // 拖拽结束,自动选择拖拽的控件项
      this.$emit('handleSetSelectItem', list[evt.oldIndex])
    },
    handleSelectItem(record) {
      // 修改选择Item
      this.setSelectedWidget(record)
    }
  }
}
</script>
