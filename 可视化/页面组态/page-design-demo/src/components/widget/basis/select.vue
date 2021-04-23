<!--
  FilePath: \src\components\basis\select.vue
  Project: page-design-demo
  CreatedAt: 2021-04-13 15:15:18
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-select
    :mode="options.mode"
    :defaultValue="options.defaultValue"
    :disabled="options.disabled"
    :allowClear="options.allowClear"
    :dropdownStyle="options.dropdownStyle"
    :size="options.size"
    :placeholder="options.placeholder"
    :style="options.customStyle"
    :showArrow="options.showArrow"
    @change="changeEvent"
  >
    <a-select-option
      v-for="(item, idx) in optionList"
      :key="idx"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script>
import basisMixins from '@/mixins/basisMixins'
import dynamicDataMixins from '@/mixins/dynamicDataMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.SELECT,
  inheritAttrs: false,
  mixins: [basisMixins, dynamicDataMixins],
  methods: {
    changeEvent(...args) {
      this.eventFunctionHandler('change', ...args)
    }
  }
}
</script>
