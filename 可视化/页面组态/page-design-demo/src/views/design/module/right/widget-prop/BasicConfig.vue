<!--
  组件基础信息配置
  FilePath: \src\views\design\module\right\basicConfig.vue
  Project: page-design-demo
  CreatedAt: 2021-04-11 16:00:40
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<script>
import { createItem } from '@/components/widget-prop/generate-props'
import { mapActions } from 'vuex'
import { debounce } from '@/utils/tools'
export default {
  name: 'BasicConfig',
  inheritAttrs: false,
  components: {},
  props: {
    currentWidget: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
      form: {},
      formRules: {}
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions('design', ['updateWidgetProp']),
    // 属性变更 公共方法处理
    handlerData(id, type) {
      const _this = this
      const handlerType = {
        getData(id) {
          let value = id.match(/\w+|\d+/g).reduce((a, b) => {
            if (a && a[b] !== void 0) {
              return a[b]
            }
          }, _this.currentWidget)

          return value
        },
        setData(data) {
          const oldVal = this.getData(data.id),
            valObj = data.value,
            newVal = valObj instanceof Event ? valObj.target.value : valObj
          if (oldVal !== newVal) {
            debounce(
              _this.updateWidgetProp({
                widgetId: _this.currentWidget.id,
                propId: data.id,
                val: newVal
              }),
              250,
              true
            )
          }
        }
      }
      return handlerType[`${type}Data`](id)
    },
    createFormItem(h) {
      const curWidget = this.currentWidget,
        curWidgetOptions = curWidget.options
      if (Object.keys(curWidget).length) {
        return (
          curWidgetOptions &&
          curWidgetOptions.map(item => {
            try {
              if (
                item.hidden &&
                typeof item.hidden === 'function' &&
                item.hidden()
              ) {
                return ''
              }
              if (item.hidden) {
                return ''
              }
              if (
                item.type === 'title' ||
                item.type === 'tips' ||
                !item.label
              ) {
                return createItem(h, item, this)
              }
              return (
                <a-form-model-item label={item.label}>
                  {createItem(h, item, this)}
                </a-form-model-item>
              )
            } catch (error) {
              return ''
            }
          })
        )
      }
    }
  },
  render(h) {
    if (Object.keys(this.currentWidget).length) {
      return h(
        'div',
        {
          class: ['attributs-setting']
        },
        [
          h(
            'a-form-model',
            {
              props: {
                model: this.form,
                rules: this.formRules,
                'label-col': this.labelCol,
                'wrapper-col': this.wrapperCol
              }
            },
            this.createFormItem(h)
          )
        ]
      )
    }
    return <span>暂无数据</span>
  }
}
</script>
