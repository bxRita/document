<!--
  FilePath: \src\components\config-panel\ConfigClass\FieldForm.vue
  Project: vue-x6-demo
  CreatedAt: 2021-04-23 15:38:53
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-modal
    :title="title"
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
      <a-form-model-item label="字段名称" prop="fieldName">
        <a-input v-model="form.fieldName" />
      </a-form-model-item>
      <a-form-model-item label="字段类型" prop="fieldType">
        <a-select
          v-model="form.fieldType"
          placeholder="请选择字段类型"
          show-search
          option-filter-prop="children"
          :filter-option="filterOption"
          allowClear
        >
          <a-select-option
            :value="item.code"
            :key="idx"
            v-for="(item, idx) in types"
          >
            {{ item.code }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="字段描述" prop="fieldType">
        <a-input v-model="form.fieldDes" />
      </a-form-model-item>
      <a-form-model-item label="必填" prop="fieldIsNull">
        <a-switch v-model="form.fieldIsNull" />
      </a-form-model-item>
      <a-form-model-item label="默认值" prop="defaultValue">
        <a-input v-model="form.defaultValue" />
      </a-form-model-item>
      <a-form-model-item label="主键类型" prop="primaryType">
        <a-select v-model="form.primaryType" placeholder="请选择主键类型">
          <a-select-option
            :value="item.value"
            :key="idx"
            v-for="(item, idx) in primaryTypes"
          >
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import { DICTIONARY_TYPE } from '@/constants'
import { getSysDictField } from '@/api/system'

export default {
  name: 'FieldForm',
  inheritAttrs: false,
  components: {},
  props: {
    title: {
      type: String,
      default: '新增字段'
    },
    item: {
      type: Object,
      default: () => {}
    },
    fieldTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      types: [],
      primaryTypes: [
        {
          value: '0',
          label: '非关系类型'
        },
        {
          value: '1',
          label: '外键关系'
        },
        {
          value: '2',
          label: '主键自定义'
        }
      ],
      visible: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        fieldName: '',
        fieldType: 'String',
        fieldDes: '',
        fieldIsNull: false,
        defaultValue: '',
        primaryType: '0'
      },
      rules: {
        fieldName: [
          {
            required: true,
            message: '请输入字段名',
            trigger: 'blur'
          }
        ],
        fieldType: [
          {
            required: true,
            message: '请输入字段类型',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  async mounted() {
    this.form = Object.assign({}, this.form, this.item)
    const basisTypes = await getSysDictField(DICTIONARY_TYPE.BASE_FIELD_TYPE)
    this.types = basisTypes.concat(this.fieldTypes)
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOk() {
      this.visible = false
      this.$emit('ok', this.form)
    },
    handleCancel() {
      this.visible = false
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped></style>
