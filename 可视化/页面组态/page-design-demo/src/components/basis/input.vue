<!--
  FilePath: \src\components\basis\input.vue
  Project: page-design-demo
  CreatedAt: 2021-04-09 10:07:38
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-input
    :placeholder="options.placeholder"
    :disabled="options.disabled"
    :size="options.size"
    :type="options.type"
    :suffix="options.suffix"
    :prefix="options.prefix"
    :maxLength="options.maxLength"
    @change="changeEvent"
    @pressEnter="pressEnterEvent"
  >
  </a-input>
</template>

<script>
import basisMixins from '@/mixins/basisMixins'
export default {
  name: 'xaInput',
  inheritAttrs: false,
  mixins: [basisMixins],
  methods: {
    /**
     * @description 按下回车的回调
     */
    pressEnterEvent() {
      this.eventFunctionHandler('pressEnter', arguments)
    },
    /**
     * @description 输入框内容变化时的回调
     */
    changeEvent() {
      this.eventFunctionHandler('change', arguments)
    }
  }
}
</script>
