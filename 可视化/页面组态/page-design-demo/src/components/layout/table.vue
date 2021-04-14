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
  >
    <table
      class="table-layout custom-table"
      :class="{
        bright: record.props.bright,
        small: record.props.small,
        bordered: record.props.bordered
      }"
      :style="record.props.customStyle"
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
            v-bind="{
              group: 'form-draggable',
              ghostClass: 'moving',
              animation: 180,
              handle: '.drag-move'
            }"
            v-model="tdItem.list"
            @start="$emit('dragStart', $event, tdItem.list)"
            @add="$emit('handleColAdd', $event, tdItem.list)"
          >
            <transition-group tag="div" name="list" class="list-main">
              <layoutItem
                class="drag-move"
                v-for="item in tdItem.list"
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
        </td>
      </tr>
    </table>

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
  name: 'xaTable',
  inheritAttrs: false,
  mixins: [layoutMixins]
}
</script>
