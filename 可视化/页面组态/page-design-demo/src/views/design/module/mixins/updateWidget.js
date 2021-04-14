/*
 * FilePath: \src\views\design\module\mixins\updateWidget.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 10:16:13
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
export default {
  computed: {
    // 检测当前组件的属性值 是否有更新
    needUpdate() {
      let str = this.$store.getters['design/widgetPropUpdate']
      if (str) {
        let arr = str.split('-')
        return arr
      } else {
        return false
      }
    }
  },
  watch: {
    // 如果当前属性值有更新  则更新组件
    needUpdate(newVal) {
      if (newVal && newVal.length) {
        let needUpdateWidget = this.$refs[newVal[0]]
        needUpdateWidget && needUpdateWidget.$forceUpdate()
      }
    }
  }
}
