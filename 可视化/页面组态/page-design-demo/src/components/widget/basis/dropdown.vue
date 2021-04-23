<!--
  FilePath: \src\components\basis\dropdown.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 17:22:11
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-dropdown
    :style="styles"
    @visibleChange="visibleChangeEvent"
    :placement="options.placement"
    :disabled="options.disabled"
  >
    <a class="ant-dropdown-link" @click="e => e.preventDefault()">
      Hover me <a-icon type="down" />
    </a>
    <a-menu slot="overlay">
      <a-menu-item
        v-for="(item, idx) in optionList"
        :key="idx"
        :value="item.value"
      >
        <a href="javascript:;">{{ item.label }}</a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
import basisMixins from '@/mixins/basisMixins'
import dynamicDataMixins from '@/mixins/dynamicDataMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.DROPDOWN,
  inheritAttrs: false,
  mixins: [basisMixins, dynamicDataMixins],
  methods: {
    visibleChangeEvent(...args) {
      this.eventFunctionHandler('visibleChange', ...args)
    }
  }
}
</script>
