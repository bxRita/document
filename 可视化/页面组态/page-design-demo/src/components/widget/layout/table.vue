<!--
  FilePath: \src\components\layout\table.vue
  Project: page-design-demo
  CreatedAt: 2021-04-09 11:17:45
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div
    class="table-box"
    :class="{ active: record.id === currentWidgetId }"
    @click.stop="handleSelectItem(record)"
    :style="styles"
  >
    <table
      class="table-layout custom-table"
      :class="{
        bright: options.bright,
        small: options.small,
        bordered: options.bordered
      }"
      :style="options.customStyle"
    >
      <tr v-for="(trItem, trIndex) in record.trs" :key="trIndex">
        <td
          class="table-td"
          v-for="(tdItem, tdIndex) in trItem.tds"
          :key="tdIndex"
          :colspan="tdItem.colspan"
          :rowspan="tdItem.rowspan"
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
            v-model="tdItem.list"
            @start="$emit('dragStart', $event, tdItem.list, record)"
            @end="
              $emit('dragEnd', $event, tdItem.list, record, {
                idx: tdIndex,
                pidx: trIndex
              })
            "
            @add="
              addSubWidget($event, tdItem.list, record, {
                idx: tdIndex,
                pidx: trIndex
              })
            "
          >
            <transition-group tag="div" name="list" class="list-main">
              <layoutItem
                class="drag-move"
                v-for="item in tdItem.list"
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
        </td>
      </tr>
    </table>
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
  name: WidgetComponentName.TABLE,
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
