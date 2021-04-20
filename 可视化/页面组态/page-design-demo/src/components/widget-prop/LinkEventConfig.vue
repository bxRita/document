<!--
  组件联动事件配置
  FilePath: \src\components\widget-prop\LinkEventConfig.vue
  Project: page-design-demo
  CreatedAt: 2021-04-19 16:27:27
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-form-model
    ref="ruleForm"
    :model="form"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-form-model-item label="事件" prop="type">
      <a-select
        v-model="form.type"
        placeholder="请选择"
        @change="changeHandler"
      >
        <a-select-option
          :value="item.eventName"
          v-for="(item, idx) in events"
          :key="idx"
        >
          {{ item.eventDes }}-{{ item.eventName }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
    <a-form-model-item label="关联组件" prop="relateId">
      <a-select
        v-model="form.relateId"
        placeholder="请选择"
        @change="changeHandler"
      >
        <a-select-option
          :value="item.id"
          v-for="(item, idx) in allWidgets"
          :key="idx"
        >
          {{ item.id }}
        </a-select-option>
      </a-select>
    </a-form-model-item>

    <!-- 根据组件配置动态加载配置项 -->
    <a-form-model-item label="组件事件" prop="exectEvent">
      <a-select
        v-model="form.exectEvent"
        placeholder="请选择"
        @change="changeHandler"
      >
        <a-select-option
          :value="item.id"
          v-for="(item, idx) in widgetPropsCfg"
          :key="idx"
        >
          {{ item.label }}
        </a-select-option>
      </a-select>
    </a-form-model-item>
  </a-form-model>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'LinkEventConfig',
  inheritAttrs: false,
  components: {},
  props: {
    eventName: String
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      form: {
        type: '',
        relateId: '',
        exectEvent: ''
      },
      rules: {
        type: [{ required: true, message: '请选择', trigger: 'blur' }],
        relateId: [{ required: true, message: '请选择', trigger: 'blur' }],
        exectEvent: [{ required: true, message: '请选择', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters('design', [
      'currentSelectItem',
      'getAllWidget',
      'getWidgetById'
    ]),
    // 关联组件的配置事件
    widgetPropsCfg() {
      let relateId = this.form.relateId
      if (relateId) {
        const refItem = this.getWidgetById(relateId)
        return refItem
          ? refItem.custom && refItem.custom.linkageEventConfig
          : []
      } else {
        return []
      }
    },
    allWidgets() {
      let all = this.getAllWidget()
      return all.filter(item => item.id !== this.currentSelectItem.id)
    },
    events() {
      let custom = this.currentSelectItem.custom
      const commonEvents = ['customEvent', 'created', 'mounted']
      return (
        (custom &&
          custom.eventConfig.filter(
            item => !commonEvents.includes(item.eventName)
          )) ||
        []
      )
    }
  },
  created() {},
  mounted() {
    if (this.eventName) {
      let es = this.eventName.split('$$')
      this.form.type = es[0]
      this.form.relateId = es[1]
      this.form.exectEvent = es[2]
    }
  },
  methods: {
    changeHandler() {
      this.$refs.ruleForm.validate(valid => {
        this.$emit('change', valid ? this.form : false)
      })
    }
  }
}
</script>
