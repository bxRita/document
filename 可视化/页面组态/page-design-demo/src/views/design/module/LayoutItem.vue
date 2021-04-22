<!--
  FilePath: \src\views\design\module\LayoutItem.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 16:31:23
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div
    :class="{
      'layout-width': ['grid', 'table', 'card', 'divider', 'html'].includes(
        record.type
      )
    }"
  >
    <component
      :is="currentComp"
      v-bind="$attrs"
      v-on="$listeners"
      :record="record"
      :custom="record.custom"
      :options="record.props"
      :ref="isLayout && record.id"
    ></component>
  </div>
</template>
<script>
import { WidgetType } from '@/constants'
import FormNode from './FormNode'
import CompUpdateMixins from '@/views/design/module/mixins/updateWidget'
import { addRefs } from '@/utils/globalWidgetRef'
export default {
  inheritAttrs: false,
  name: 'layoutItem',
  props: {
    record: {
      // 当前组件配置
      type: Object,
      required: true
    }
  },
  mixins: [CompUpdateMixins],
  components: {
    FormNode
  },
  data() {
    return {
      currentComp: null
    }
  },
  computed: {
    isLayout() {
      return this.record.type === WidgetType.layout
    }
  },
  mounted() {
    this.currentComp = this.isLayout ? this.record.key : 'FormNode'

    this.$nextTick(() => {
      addRefs(this.$refs)
    })
  }
}
</script>
