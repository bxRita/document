<!--
  FilePath: \src\components\basis\button.vue
  Project: page-design-demo
  CreatedAt: 2021-04-09 10:07:30
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-button
    :style="styles"
    :type="options.type"
    :disabled="options.disabled"
    :loading="options.loading"
    :shape="options.shape"
    :size="options.size"
    :block="options.block"
    :ghost="options.ghost"
    @click="clickEvent"
  >
    {{ options.content }}
  </a-button>
</template>

<script>
import basisMixins from '@/mixins/basisMixins'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.BUTTON,
  inheritAttrs: false,
  mixins: [basisMixins],
  methods: {
    clickEvent(...args) {
      this.eventFunctionHandler('click', ...args)
    }
  }
}
</script>
