<!--
  FilePath: \src\components\widget-prop\ConfigPagination.vue
  Project: page-design-demo
  CreatedAt: 2021-04-22 09:27:59
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div>
    <a-button size="small" @click="showModal"> 配置分页信息 </a-button>
    <a-modal
      title="分页信息配置"
      :visible="visible"
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
        <a-form-model-item label="启用分页" prop="disabled">
          <a-switch v-model="form.disabled" />
        </a-form-model-item>
        <a-form-model-item
          label="只有一页时是否隐藏分页器"
          prop="hideOnSinglePage"
        >
          <a-switch v-model="form.hideOnSinglePage" />
        </a-form-model-item>
        <a-form-model-item label="条数" prop="pageSize">
          <a-select v-model="form.pageSize" placeholder="请选择">
            <a-select-option value="10">10</a-select-option>
            <a-select-option value="20">20</a-select-option>
            <a-select-option value="30">30</a-select-option>
            <a-select-option value="40">40</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="是否可快速跳转至某页" prop="showQuickJumper">
          <a-switch v-model="form.showQuickJumper" />
        </a-form-model-item>
        <a-form-model-item label="简单分页" prop="simple">
          <a-switch v-model="form.simple" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'ConfigPagination',
  inheritAttrs: false,
  props: {
    paginationInfo: Object
  },
  data() {
    return {
      visible: false,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
      form: {
        disabled: false,
        hideOnSinglePage: true,
        pageSize: 10,
        showQuickJumper: true,
        simple: false
      },
      rules: {
        name: []
      }
    }
  },
  created() {},
  mounted() {
    this.form = Object.assign({}, this.form, this.paginationInfo)
  },
  methods: {
    handleOk() {
      this.visible = false
      this.$emit('change', this.form)
    },
    handleCancel() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
::v-deep .ant-modal-body {
  .ant-form {
    .ant-row {
      .ant-form-item-control-wrapper {
        flex: 0 0 auto;
        float: left;
        display: block;
        box-sizing: border-box;
        width: 58.33333333%;
      }
    }
  }
}
</style>
