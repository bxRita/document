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
  >
    <a-row
      class="grid-row"
      :type="record.props.type"
      :gutter="record.props.gutter"
      :justify="record.props.justify"
      :align="record.props.align"
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
          v-bind="{
            group: 'form-draggable',
            ghostClass: 'moving',
            animation: 180,
            handle: '.drag-move'
          }"
          v-model="colItem.list"
          @start="$emit('dragStart', $event, colItem.list)"
          @add="$emit('handleColAdd', $event, colItem.list)"
        >
          <transition-group tag="div" name="list" class="list-main">
            <layout-item
              class="drag-move"
              v-for="item in colItem.list"
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
      </a-col>
    </a-row>

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
  name: 'xaGrid',
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
