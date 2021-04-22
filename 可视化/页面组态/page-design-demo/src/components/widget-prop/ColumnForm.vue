<!--
  FilePath: \src\components\widget-prop\ColumnForm.vue
  Project: page-design-demo
  CreatedAt: 2021-04-22 11:00:06
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<template>
  <a-modal
    title="增加表格列"
    :visible="visible"
    width="40%"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-model-item label="列头显示文字" prop="title">
        <a-input v-model="form.title" />
      </a-form-model-item>
      <a-form-model-item label="列宽" prop="width">
        <a-input v-model="form.width" />
      </a-form-model-item>
      <a-form-model-item label="数据项中对应的 key" prop="dataIndex">
        <a-input v-model="form.dataIndex" />
      </a-form-model-item>
      <a-form-model-item label="列内容的对齐方式" prop="align">
        <a-select v-model="form.align" placeholder="请选择">
          <a-select-option value="left">left</a-select-option>
          <a-select-option value="right">right</a-select-option>
          <a-select-option value="center">center</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="超过宽度将自动省略" prop="ellipsis">
        <a-switch v-model="form.ellipsis" />
      </a-form-model-item>
      <a-form-model-item label="是否多选" prop="filterMultiple">
        <a-switch v-model="form.filterMultiple" />
      </a-form-model-item>
      <a-form-model-item label="列固定" prop="fixed">
        <a-switch v-model="form.fixed" />
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
export default {
  name: 'ColumnForm',
  inheritAttrs: false,
  props: {
    dataInfo: Object,
    show: Boolean
  },
  data() {
    return {
      visible: this.show,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        title: '',
        width: null,
        dataIndex: '',
        ellipsis: false,
        filterMultiple: true,
        fixed: false,
        align: 'left'
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入列标题',
            trigger: 'blur'
          }
        ],
        dataIndex: [
          {
            required: true,
            message: '请输入列标题',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {},
  mounted() {
    this.form = Object.assign({}, this.form, this.dataInfo)
  },
  methods: {
    handleOk() {
      this.visible = false
      this.$emit('ok', this.form)
    },
    handleCancel() {
      this.visible = false
      this.$emit('cancel')
    },
    showModal() {
      this.visible = true
    }
  }
}
</script>
