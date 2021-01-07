/*
 * FilePath: src\components\ag-grid\checkbox-render\checkboxRenderer.js
 * Project: HolliEBR
 * CreatedAt: 2020-03-03 09:48:51
 * CreatedBy: bx (<bx@hollysys.net>)
 * Copyright: (c) 2020
 * Task: #1
 * Write a description of the code here.
 * 复选框
 */
import Vue from 'vue'

export default Vue.extend({
  template: `
        <v-checkbox v-model="checked" readonly></v-checkbox>
    `,
  data: function() {
    return {
      checked: false
    }
  },
  mounted() {
    let val = this.params.value
    this.checked =
      typeof val === 'string' ? (val === 'false' ? false : true) : val
  }
})
