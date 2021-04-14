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
export default {
  name: 'xaSelect',
  inheritAttrs: false,
  mixins: [basisMixins],
  data() {
    return {
      optionList: []
    }
  },
  mounted() {
    this.init()
    // this.$http.get('/api/pass/appResource/systemNameText')
    // /api/pass/workStations
  },
  watch: {
    options: {
      handler(newVal, oldVal) {
        this.init()
      },
      deep: true
    }
  },
  methods: {
    async init() {
      if (this.options.isDynamic) {
        let res = await this.$http.get(this.options.dynamicUrl),
          data = res.data

        let result = []
        if (data instanceof Array) {
          let len = data.length
          for (let i = 0; i < len; i++) {
            result.push({
              value: data[i].code,
              label: data[i].code
            })
          }
        } else {
          for (let key in data) {
            result.push({
              value: key,
              label: key
            })
          }
        }
        this.optionList = result
      } else {
        this.optionList = this.options.options
      }
    },
    changeEvent() {
      this.eventFunctionHandler('change')
    }
  }
}
</script>
