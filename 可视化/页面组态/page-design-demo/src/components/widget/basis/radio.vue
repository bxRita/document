<!--
  FilePath: \src\components\widget\basis\radio.vue
  Project: page-design-demo
  CreatedAt: 2021-04-21 15:45:10
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <a-radio-group v-bind="options" @change="changeEvent" :style="styles">
    <component
      :is="radioType"
      :value="item.value"
      v-for="(item, idx) in optionList"
      :key="idx"
    >
      {{ item.label }}
    </component>
  </a-radio-group>
</template>

<script>
import basisMixins from '@/mixins/basisMixins'
import dynamicDataMixins from '@/mixins/dynamicDataMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.RADIO,
  inheritAttrs: false,
  mixins: [basisMixins, dynamicDataMixins],
  computed: {
    radioType() {
      return this.options.radioType == 'radio' ? 'a-radio' : 'a-radio-button'
    }
  },
  methods: {
    changeEvent(event) {
      this.eventFunctionHandler('change', event.target.value, event.target)
    }
  }
}
</script>
