<!--
  FilePath: \src\views\design\module\RightPropArea.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 09:51:23
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-collapse v-model="activeKey">
    <a-collapse-panel key="1" header="页面属性">
      <page-prop></page-prop>
    </a-collapse-panel>
    <a-collapse-panel key="2" header="组件属性">
      <widget-prop
        v-if="currentSelectItem"
        :currentWidget="currentSelectItem"
        :key="currentSelectItem.id"
        ref="widgetProp"
      ></widget-prop>
    </a-collapse-panel>
  </a-collapse>
</template>

<script>
import { PageProp, WidgetProp } from './right'
import { isEqual } from 'lodash'
export default {
  name: 'RightPropArea',
  inheritAttrs: false,
  components: {
    PageProp,
    WidgetProp
  },
  props: {
    currentSelectItem: {
      type: Object
    }
  },
  data() {
    return {
      activeKey: '1'
    }
  },
  watch: {
    currentSelectItem: {
      handler(newVal, oldVal) {
        isEqual(newVal, oldVal) &&
          this.$refs.widgetProp &&
          this.$refs.widgetProp.$forceUpdate()
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
