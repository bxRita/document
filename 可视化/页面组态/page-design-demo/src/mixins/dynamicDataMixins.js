/*
 * 从服务端动态加载数据源
 * FilePath: \src\mixins\dynamicDataMixins.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-16 11:08:47
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import { getHttpConfigByCondition } from '@/utils/tools'
export default {
  data() {
    return {
      optionList: []
    }
  },

  mounted() {
    this.getDatasFromServer()
  },
  watch: {
    options: {
      handler(newVal, oldVal) {
        this.getDatasFromServer()
      },
      deep: true
    }
  },
  methods: {
    // TODO: 可以动态根据服务数据结构来 解析数据
    async getDatasFromServer() {
      const op = this.options
      if (op.isDynamic) {
        const { dynamicCfg } = op
        const { chooseFields, valueField, labelField } = dynamicCfg
        let res = await this.$http(getHttpConfigByCondition(dynamicCfg))
        if (!chooseFields) {
          // 如果没有输入筛选字段
          res instanceof Array
            ? (this.optionList = res)
            : this.$message.error('请配置筛选字段')
          return
        }

        if (!valueField || !labelField) {
          this.$message.error('值或文本属性不能为空')
          return
        }
        let fields = chooseFields.split('.')

        let data = fields.reduce((a, b) => {
          if (a && a[b] !== void 0) {
            return a[b]
          }
        }, res)

        let result = []
        if (data instanceof Array) {
          let len = data.length
          for (let i = 0; i < len; i++) {
            result.push({
              ...data[i],
              value: data[i][valueField],
              label: data[i][labelField]
            })
          }
        } else {
          for (let key in data) {
            result.push({
              ...data,
              value: data[key],
              label: key
            })
          }
        }
        this.optionList = result
      } else {
        this.optionList = op.options
      }
    }
  }
}
