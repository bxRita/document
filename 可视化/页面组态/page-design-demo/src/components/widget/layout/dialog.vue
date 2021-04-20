<!--
  FilePath: \src\components\layout\dialog.vue
  Project: page-design-demo
  CreatedAt: 2021-04-13 18:00:52
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <div
    class="grid-box"
    :class="{ active: record.id === currentWidgetId }"
    @click.stop="handleSelectItem(record)"
  >
    <component
      :is="currentComp"
      class="grid-row"
      :title="options.title"
      :width="options.width"
      :cancelText="options.cancelText"
      :centered="options.centered"
      :closable="options.closable"
      :confirmLoading="options.confirmLoading"
      :destroyOnClose="options.destroyOnClose"
      :keyboard="options.keyboard"
      :mask="options.mask"
      :maskClosable="options.maskClosable"
      :okText="options.okText"
      :okType="options.okType"
      :visible="options.visible"
      @ok="okEvent"
      @cancel="cancelEvent"
    >
      <div class="grid-col">
        <draggable
          tag="div"
          class="draggable-box"
          :disabled="isRuntime"
          v-bind="{
            group: 'form-draggable',
            ghostClass: 'moving',
            animation: 180,
            handle: '.drag-move'
          }"
          v-model="record.list"
          @start="$emit('dragStart', $event, record.list)"
        >
          <transition-group tag="div" name="list" class="list-main">
            <layoutItem
              class="drag-move"
              v-for="item in record.list"
              :key="item.id"
              :selectItem.sync="selectItem"
              :insertAllowedType="insertAllowedType"
              :record="item"
              :isRuntime="isRuntime"
              :hideModel="hideModel"
              :config="config"
              @handleSelectItem="handleSelectItem"
              @handleCopy="$emit('handleCopy')"
              @handleDelete="$emit('handleDelete')"
            />
          </transition-group>
        </draggable>
      </div>
    </component>
    <template v-if="!isRuntime">
      <div
        class="copy"
        :class="record.id === currentWidgetId ? 'active' : 'unactivated'"
        @click.stop="$emit('handleCopy')"
      >
        <a-icon type="copy" />
      </div>
      <div
        class="delete"
        :class="record.id === currentWidgetId ? 'active' : 'unactivated'"
        @click.stop="$emit('handleDelete')"
      >
        <a-icon type="delete" />
      </div>
    </template>
  </div>
</template>

<script>
import { Card, Modal } from 'ant-design-vue'
import layoutMixins from '@/mixins/layoutMixins'
export default {
  name: 'xaDialog',
  inheritAttrs: false,
  mixins: [layoutMixins],
  data() {
    return {
      currentComp: null
    }
  },
  methods: {
    okEvent(...args) {
      this.eventFunctionHandler('ok', ...args)
      this.options.visible = false
    },
    cancelEvent(...args) {
      this.eventFunctionHandler('cancel', ...args)
      this.options.visible = false
    },
    setDisplay() {
      this.options.visible = !this.options.visible
    }
  },
  mounted() {
    this.currentComp = this.isRuntime ? Modal : Card
  }
}
</script>
