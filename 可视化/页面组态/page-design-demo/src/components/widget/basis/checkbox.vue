<!--
  FilePath: \src\components\basis\checkbox.vue
  Project: page-design-demo
  CreatedAt: 2021-04-16 09:12:27
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <a-checkbox-group
    :style="styles"
    :defaultValue="options.defaultValue"
    :disabled="options.disabled"
    :options="optionList"
    :name="options.name"
    @change="changeEvent"
  >
  </a-checkbox-group>
</template>

<script>
import { WidgetComponentName } from '@/constants'
import basisMixins from '@/mixins/basisMixins'
import dynamicDataMixins from '@/mixins/dynamicDataMixins'
export default {
  name: WidgetComponentName.CHECKBOX,
  inheritAttrs: false,
  mixins: [basisMixins, dynamicDataMixins],
  methods: {
    changeEvent(...args) {
      this.eventFunctionHandler('change', ...args)
    }
  }
}
</script>
