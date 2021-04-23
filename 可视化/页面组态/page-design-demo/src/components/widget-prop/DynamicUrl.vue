<!--
  动态URL 配置以及 接口数据预览
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
    <a-button size="small" @click="showModal"> 配置数据集 </a-button>
    <a-modal
      title="接口数据预览"
      :visible="visible"
      width="85%"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-row>
        <a-col :span="16"
          ><a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            v-bind="formItemLayout"
          >
            <a-row :gutter="10">
              <a-col :span="12">
                <a-form-model-item label="URL" prop="url">
                  <a-input v-model="form.url" />
                </a-form-model-item>
              </a-col>

              <a-col :span="12">
                <a-form-model-item label="请求类型" prop="type">
                  <a-select v-model="form.type" placeholder="请选择">
                    <a-select-option value="get"> Get </a-select-option>
                    <a-select-option value="post"> Post </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="10">
              <a-col :span="12">
                <a-form-model-item label="请求条数" prop="pageSize">
                  <a-select v-model="form.pageSize" placeholder="请选择">
                    <a-select-option
                      v-for="(ps, idx) in pageSizes"
                      :value="ps"
                      :key="idx"
                      >{{ ps }}</a-select-option
                    >
                  </a-select>
                </a-form-model-item>
              </a-col>

              <a-col :span="12">
                <a-form-model-item
                  v-for="(param, index) in form.params"
                  :key="index"
                  :label="'参数' + (index + 1)"
                  :rules="{
                    required: true,
                    message: 'params can not be null',
                    trigger: 'blur'
                  }"
                >
                  <a-input
                    v-model="param.key"
                    placeholder="参数名"
                    style="width: 46%; margin-right: 3px"
                  />
                  <a-input
                    v-model="param.value"
                    placeholder="参数值"
                    style="width: 45%; margin-right: 3px"
                  />
                  <a-icon
                    class="dynamic-delete-button"
                    type="minus-circle-o"
                    :disabled="form.params.length === 1"
                    @click="removeDomain(index)"
                  />
                </a-form-model-item>
                <a-form-model-item v-bind="formItemLayoutWithOutLabel">
                  <a-button type="dashed" style="width: 60%" @click="addParams">
                    <a-icon type="plus" />增加请求参数
                  </a-button>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row :gutter="10">
              <a-col :span="8">
                <a-form-model-item label="排序字段" prop="orderBy">
                  <a-input v-model="form.orderBy" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="升/降序" prop="orderDesc">
                  <a-checkbox v-model="form.orderDesc"> 升序 </a-checkbox>
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-button @click="previewData" type="primary">预览</a-button>
              </a-col>
            </a-row>
            <a-row :gutter="10">
              <a-col :span="8">
                <a-form-model-item label="筛选字段" prop="chooseFields">
                  <a-input
                    v-model="form.chooseFields"
                    placeholder="字段属性用.隔开"
                  />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="值字段" prop="valueField">
                  <a-input v-model="form.valueField" placeholder="选项值属性" />
                </a-form-model-item>
              </a-col>
              <a-col :span="8">
                <a-form-model-item label="文本字段" prop="labelField">
                  <a-input v-model="form.labelField" placeholder="文本属性" />
                </a-form-model-item>
              </a-col>
            </a-row> </a-form-model
        ></a-col>
        <a-col :span="8">
          <div>接口返回数据</div>
          <CodeEditor
            ref="dynamicCodeEditorRef"
            :codeContent="result"
            language="json"
            :readOnly="true"
          />
        </a-col>
      </a-row>
    </a-modal>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { getHttpConfigByCondition } from '@/utils/tools'
export default {
  name: 'DynamicUrl',
  inheritAttrs: false,
  props: {
    widgetProps: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pageSizes: [10, 20, 30, 50, 100],
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      formItemLayoutWithOutLabel: {
        wrapperCol: {
          xs: { span: 24, offset: 0 },
          sm: { span: 20, offset: 4 }
        }
      },
      form: {
        url: '',
        type: '',
        pageSize: 30,
        orderBy: '',
        orderDesc: false,
        chooseFields: '',
        valueField: 'value',
        labelField: 'label',
        params: []
      },
      rules: {
        url: [{ required: true, message: 'URL接口地址', trigger: 'blur' }],
        type: [{ required: true, message: '请求类型', trigger: 'blur' }],
        valueField: [{ required: true, message: '值字段', trigger: 'blur' }],
        labelField: [{ required: true, message: '文本字段', trigger: 'blur' }]
      },
      visible: false,
      result: '' // 服务请求结果
    }
  },
  mounted() {
    let dyCfg = cloneDeep(this.widgetProps.dynamicCfg)
    this.form = Object.assign(this.form, dyCfg)
  },
  methods: {
    previewData() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.getDataFromServer()
        } else {
          this.$message.warning('请确保所有必填项数据均填写')
          return false
        }
      })
    },
    /**
     * @description 动态添加参数
     */
    addParams() {
      this.form.params.push({
        key: '',
        value: ''
      })
    },
    removeDomain(idx) {
      this.form.params.splice(idx, 1)
    },
    /**
     * @description 根据URL请求数据
     */
    async getDataFromServer() {
      let res = await this.$http(getHttpConfigByCondition(this.form))

      this.result = JSON.stringify(res)
    },
    /**
     * @description 点击弹框的确定按钮
     */
    handleOk() {
      this.$emit('change', this.form)
      this.visible = false
    },
    /**
     * @description 点击弹框的取消按钮
     */
    handleCancel(e) {
      this.visible = false
    },
    showModal() {
      this.visible = true
    }
  }
}
</script>
<style lang="less" scoped>
.ant-modal-body {
  .code-editor {
    .monaco-editor {
      min-height: 300px;
    }
  }
}
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
