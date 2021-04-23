<!--
  FilePath: \src\components\widget\basis\datepicker.vue
  Project: page-design-demo
  CreatedAt: 2021-04-20 17:25:04
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <component
    :is="curComp"
    v-bind="options"
    :style="styles"
    @openChange="openChangeEvent"
    @panelChange="panelChangeEvent"
  >
  </component>
</template>

<script>
const DateType = {
  date: 'a-date-picker',
  month: 'a-month-picker',
  range: 'a-range-picker',
  week: 'a-week-picker'
}
import basisMixins from '@/mixins/basisMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.DATEPICKER,
  inheritAttrs: false,
  mixins: [basisMixins],
  data() {
    return {
      curComp: DateType.date
    }
  },
  watch: {
    'options.mode': {
      handler(newValue, oldValue) {
        this.curComp = DateType[newValue]
      },
      deep: true
    }
  },
  methods: {
    panelChangeEvent(...args) {
      this.eventFunctionHandler('panelChange', ...args)
    },
    openChangeEvent(...args) {
      this.eventFunctionHandler('openChange', ...args)
    }
  }
}
</script>
