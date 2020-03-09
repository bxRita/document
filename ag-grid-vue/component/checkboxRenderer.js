/*
 * FilePath: \src\views\product\equipment-manager\attribute-list\status-info\checkboxRenderer.js
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
  beforeMount() {},
  mounted() {
    this.checked = this.params.value
  },
  methods: {}
})
