<!--
  设计预览界面
  FilePath: \src\views\preview\index.vue
  Project: page-design-demo
  CreatedAt: 2021-04-06 16:40:51
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <div class="form-panel">
    <a-form
      class="a-form-box k-form-build"
      :layout="designData.config.layout"
      :hideRequiredMark="designData.config.hideRequiredMark"
      :style="designData.config.customStyle"
    >
      <layoutItem
        class="drag-move"
        v-for="record in designData.list"
        :isRuntime="true"
        :key="record.id"
        :record="record"
        :config="designData.config"
      />
    </a-form>
  </div>
</template>
<script>
import layoutItem from '@/views/design/module/LayoutItem.vue'
import { LocalPageDataKey } from '@/constants'
export default {
  name: 'Preview',
  inheritAttrs: false,
  data() {
    return {
      designData: {
        config: {},
        list: []
      }
    }
  },
  mounted() {
    let dataStr = localStorage.getItem(LocalPageDataKey)
    this.designData = JSON.parse(dataStr)
  },
  components: {
    layoutItem
  }
}
</script>
