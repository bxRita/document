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
    :style="styles"
  >
    <a-tabs class="grid-row" v-bind="options" @change="changeTabEvent">
      <a-tab-pane
        v-for="(tabItem, idx) in record.columns"
        :key="tabItem.value"
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
            @start="$emit('dragStart', $event, tabItem.list, record)"
            @end="$emit('dragEnd', $event, tabItem.list, record, { idx: idx })"
            @add="addSubWidget($event, tabItem.list, record, { idx: idx })"
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
                @addSubWidget="addSubWidget"
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
import { WidgetComponentName } from '@/constants'
import { mapActions } from 'vuex'
import layoutMixins from '@/mixins/layoutMixins'
export default {
  name: WidgetComponentName.TABS,
  inheritAttrs: false,
  mixins: [layoutMixins],
  data() {
    return {}
  },
  methods: {
    ...mapActions('design', ['updateWidgetProp']),
    changeTabEvent(val) {
      this.eventFunctionHandler('change', val)
      this.options.activeKey = val
      this.updateWidgetProp({
        widgetId: this.currentWidgetId,
        propId: 'props.activeKey',
        val
      })
    },
    switchTabHandler(...args) {
      let len = args.length
      if (len > 0) {
        const val = args[0]
        this.options.activeKey =
          typeof val == 'string'
            ? val
            : val instanceof 'array' && val.length && val[val.length - 1]
      }
    }
  }
}
</script>
