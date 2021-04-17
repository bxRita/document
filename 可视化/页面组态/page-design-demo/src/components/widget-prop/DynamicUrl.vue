<!--
  动态URL 配置以及 数据预览
  FilePath: \src\components\widget-prop\DynamicUrl.vue
  Project: page-design-demo
  CreatedAt: 2021-04-16 16:49:50
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div>
    <a-input
      :value="defaultVal"
      size="small"
      placeholder="请输入"
      :disabled="disabled"
      @change="changeHandler"
    >
    </a-input>
    <a-button type="primary" size="small" @click="showModal">
      数据预览
    </a-button>
    <a-modal
      title="服务数据预览"
      :visible="visible"
      :footer="null"
      @cancel="handleCancel"
    >
      <CodeEditor
        ref="dynamicCodeEditorRef"
        :codeContent="result"
        language="json"
      />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'DynamicUrl',
  inheritAttrs: false,
  props: {
    defaultVal: String,
    disabled: Boolean
  },
  data() {
    return {
      visible: false,
      result: '' // 服务请求结果
    }
  },
  watch: {
    defaultVal() {
      this.getDataFromServer()
    }
  },
  mounted() {
    this.getDataFromServer()
  },
  methods: {
    /**
     * @description 根据URL请求数据
     */
    async getDataFromServer() {
      if (!this.defaultVal) {
        this.result = ``
        return
      }

      let res = await this.$http.get(this.defaultVal)

      this.result = JSON.stringify(res)
    },
    handleCancel(e) {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    changeHandler(e) {
      this.$emit('change', e)
    }
  }
}
</script>
