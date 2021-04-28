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
    width="45%"
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
          @change="changeFieldType"
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
            :value="item.code"
            :key="idx"
            v-for="(item, idx) in primaryTypes"
          >
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <template v-if="!typeItem.isBasic">
        <a-form-model-item label="模型关联类型" prop="foreignKeyType">
          <a-select
            v-model="form.foreignRela.foreignKeyType"
            placeholder="请选择"
          >
            <a-select-option
              :value="item.code"
              :key="idx"
              v-for="(item, idx) in foreignTypes"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="模型关联字段" prop="foreignRelaTo">
          <a-select v-model="form.foreignRela.to" placeholder="请选择">
            <a-select-option
              :value="item.fieldName"
              :key="idx"
              v-for="(item, idx) in relFields"
            >
              {{ item.fieldName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
      </template>
    </a-form-model>
  </a-modal>
</template>

<script>
import { cloneDeep } from 'lodash'
import { DICTIONARY_TYPE } from '@/config'
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
    },
    basisTypes: {
      type: Array,
      default: () => []
    },
    foreignTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      types: [],
      primaryTypes: [],
      relFields: [],
      visible: true,
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      form: {
        fieldName: '',
        fieldType: 'String',
        fieldDes: '',
        fieldIsNull: false,
        defaultValue: '',
        primaryType: '0',
        foreignRela: {
          foreignKeyType: '0',
          from: '',
          to: ''
        }
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
  computed: {
    typeItem() {
      let fieldType = this.form.fieldType
      const typeItem = this.types.find(item => item.code === fieldType)
      return (typeItem && (typeItem.isBasic ? typeItem : typeItem.data)) || {}
    }
  },
  async mounted() {
    this.form = Object.assign({}, this.form, this.item)
    const basisTypes = cloneDeep(this.basisTypes)
    // 标识基本类型
    basisTypes.map(item => {
      item.isBasic = true
      return item
    })
    this.types = basisTypes.concat(this.fieldTypes)

    this.primaryTypes = await getSysDictField(
      DICTIONARY_TYPE.BASE_MODELPRIMARY_TYPE
    )
  },
  methods: {
    changeFieldType() {
      let typeItem = this.typeItem
      // 类别类型的时候 为关联表字段
      this.relFields = !typeItem.isBasic ? typeItem.fieldsList : []
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    handleOk() {
      this.visible = false
      let typeItem = this.typeItem
      typeItem.isBasic && delete this.form.foreignRela

      console.log(this.form)
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
