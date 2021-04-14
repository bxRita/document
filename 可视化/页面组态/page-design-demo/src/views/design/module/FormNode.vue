<!--
  FilePath: \src\views\design\module\FormNode.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 16:33:55
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div
    class="drag-move-box"
    @click.stop="$emit('handleSelectItem', record)"
    :class="{ active: record.id === curSelId }"
  >
    <div class="form-item-box">
      <component
        :is="record.key"
        :options="record.props"
        :custom="record.custom"
        :ref="record.id"
        :key="record.id"
      />
    </div>

    <div
      class="copy"
      :class="record.id === curSelId ? 'active' : 'unactivated'"
      @click.stop="$emit('handleCopy')"
    >
      <a-icon type="copy" />
    </div>
    <div
      class="delete"
      :class="record.id === curSelId ? 'active' : 'unactivated'"
      @click.stop="$emit('handleDelete')"
    >
      <a-icon type="delete" />
    </div>
  </div>
</template>
<script>
import CompUpdateMixins from '@/views/design/module/mixins/updateWidget'
export default {
  props: {
    record: {
      type: Object,
      required: true
    },
    selectItem: {
      type: Object,
      default: () => {}
    }
  },
  mixins: [CompUpdateMixins],
  computed: {
    // 当前选中组件id
    curSelId() {
      return (this.selectItem && this.selectItem.id) || null
    }
  }
}
</script>
