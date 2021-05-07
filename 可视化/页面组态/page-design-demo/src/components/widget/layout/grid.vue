<!--
  FilePath: \src\components\layout\grid.vue
  Project: page-design-demo
  CreatedAt: 2021-04-09 10:55:49
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
    <a-row
      class="grid-row"
      :type="options.type"
      :gutter="[5, 2]"
      :justify="options.justify"
      :align="options.align"
    >
      <a-col
        class="grid-col"
        v-for="(colItem, idnex) in record.columns"
        :key="idnex"
        :span="colItem.span || 0"
      >
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
          @remove="$emit('dragRemove', $event, colItem.list, record)"
          @start="$emit('dragStart', $event, colItem.list, record)"
          @end="$emit('dragEnd', $event, colItem.list, record, { idx: idnex })"
          @add="addSubWidget($event, colItem.list, record, { idx: idnex })"
        >
          <transition-group tag="div" name="list" class="list-main">
            <layout-item
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
      </a-col>
    </a-row>
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
  name: WidgetComponentName.GRID,
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
