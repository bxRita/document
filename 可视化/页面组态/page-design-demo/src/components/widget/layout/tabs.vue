<!--
  FilePath: \src\components\layout\tabs.vue
  Project: page-design-demo
  CreatedAt: 2021-04-09 11:16:54
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
    <a-tabs
      class="grid-row"
      :defaultActiveKey="0"
      :tabBarGutter="record.props.tabBarGutter || null"
      :type="record.props.type"
      :size="record.props.size"
      :tabPosition="record.props.tabPosition"
      :animated="record.props.animated"
    >
      <a-tab-pane
        v-for="(tabItem, index) in record.columns"
        :key="index"
        :tab="tabItem.label"
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
            v-model="tabItem.list"
            @start="$emit('dragStart', $event, tabItem.list)"
          >
            <transition-group tag="div" name="list" class="list-main">
              <layoutItem
                class="drag-move"
                v-for="item in tabItem.list"
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
      </a-tab-pane>
    </a-tabs>
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
export default {
  name: 'xaTabs',
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
