<!--
  FilePath: \src\components\widget\layout\layout-simple.vue
  Project: page-design-demo
  CreatedAt: 2021-05-06 14:00:04
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
    :style="styles"
  >
    <a-layout>
      <component
        :is="colItem.key"
        v-for="(colItem, idx) in record.columns"
        :key="idx"
        :class="!isRuntime && designCls"
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
            v-model="colItem.list"
            @start="$emit('dragStart', $event, colItem.list, record)"
            @end="$emit('dragEnd', $event, colItem.list, record, { idx: idx })"
            @add="addSubWidget($event, colItem.list, record, { idx: idx })"
          >
            <transition-group tag="div" name="list" class="list-main">
              <layoutItem
                class="drag-move"
                v-for="item in colItem.list"
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
                @addSubWidget="addSubWidget"
              />
            </transition-group>
          </draggable>
        </div>
      </component>
    </a-layout>
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
import layoutMixins from '@/mixins/layoutMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.LAYOUT_SIMPLE,
  inheritAttrs: false,
  mixins: [layoutMixins],
  data() {
    return {
      designCls: { isDesign: true }
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-layout {
  background: #fff;
  height: 100%;
  .ant-layout-header {
    background-color: #fff;
    .list-main {
      background-color: #fff;
    }
  }
  .ant-layout-content.isDesign {
    min-height: 150px;
    border: #dedede solid 1px;
    .list-main {
      background-color: #fff;
    }
  }
  .ant-layout-footer {
    min-height: 30px;
    background-color: #fff;
    .list-main {
      background-color: #fff;
    }
  }
}
</style>
