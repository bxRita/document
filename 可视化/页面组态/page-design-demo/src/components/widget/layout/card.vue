<!--
  FilePath: \src\components\layout\card.vue
  Project: page-design-demo
  CreatedAt: 2021-04-09 11:17:38
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
    <a-card class="grid-row" :title="options.title" :size="options.size">
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
          @start="$emit('dragStart', $event, record.list, record)"
          @end="$emit('dragEnd', $event, record.list, record)"
          @add="addSubWidget($event, record.list, record)"
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
              @addSubWidget="addSubWidget"
            />
          </transition-group>
        </draggable>
      </div>
    </a-card>
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
  name: WidgetComponentName.CARD,
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
