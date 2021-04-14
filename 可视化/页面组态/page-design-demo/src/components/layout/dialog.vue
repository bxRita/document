<!--
  FilePath: \src\components\custom\dialog.vue
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
      :title="record.props.title"
      :width="record.props.width"
      :cancelText="record.props.cancelText"
      :centered="record.props.centered"
      :closable="record.props.closable"
      :confirmLoading="record.props.confirmLoading"
      :destroyOnClose="record.props.destroyOnClose"
      :footer="record.props.footer"
      :keyboard="record.props.keyboard"
      :mask="record.props.mask"
      :maskClosable="record.props.maskClosable"
      :okText="record.props.okText"
      :okType="record.props.okType"
      :visible="record.props.visible"
      @ok="okEvent"
      @cancel="cancelEvent"
    >
      <div class="grid-col">
        <draggable
          tag="div"
          class="draggable-box"
          v-bind="{
            group: 'form-draggable',
            ghostClass: 'moving',
            animation: 180,
            handle: '.drag-move'
          }"
          v-model="record.list"
          @start="$emit('dragStart', $event, record.list)"
          @add="$emit('handleColAdd', $event, record.list)"
        >
          <transition-group tag="div" name="list" class="list-main">
            <layoutItem
              class="drag-move"
              v-for="item in record.list"
              :key="item.id"
              :selectItem.sync="selectItem"
              :insertAllowedType="insertAllowedType"
              :record="item"
              :hideModel="hideModel"
              :config="config"
              @handleSelectItem="handleSelectItem"
              @handleColAdd="handleColAdd"
              @handleCopy="$emit('handleCopy')"
              @handleDelete="$emit('handleDelete')"
            />
          </transition-group>
        </draggable>
      </div>
    </component>

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
    okEvent() {
      this.eventFunctionHandler('ok')
    },
    cancelEvent() {
      this.eventFunctionHandler('cancel')
    }
  },
  mounted() {
    this.currentComp = this.record.props.isDesign ? Card : Modal
  }
}
</script>
