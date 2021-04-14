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
  >
    <a-card
      class="grid-row"
      :title="record.props.title"
      :size="record.props.size"
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
    </a-card>

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
import layoutMixins from '@/mixins/layoutMixins'
export default {
  name: 'xaCard',
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
