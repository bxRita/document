<!--
  FilePath: \src\views\design\module\right\WidgetProp.vue
  Project: page-design-demo
  CreatedAt: 2021-04-11 15:50:30
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="基础配置">
      <basic-config v-bind="$attrs"></basic-config>
    </a-tab-pane>
    <a-tab-pane key="2" tab="事件配置" force-render>
      <event-setting v-bind="$attrs"></event-setting>
    </a-tab-pane>
  </a-tabs>
</template>

<script>
import BasicConfig from './widget-prop/BasicConfig.vue'
import EventSetting from './event-setting/EventSetting.vue'
export default {
  name: 'WidgetProp',
  inheritAttrs: false,
  components: {
    BasicConfig,
    EventSetting
  },
  data() {
    return {}
  },
  created() {},
  mounted() {},
  methods: {}
}
</script>
