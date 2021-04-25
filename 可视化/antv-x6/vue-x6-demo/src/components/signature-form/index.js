/*
 * FilePath: \src\components\signature-form\index.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-25 14:53:41
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import Vue from 'vue'
import SignatureModal from './signature-form'
import store from '@/store'

/**
 * 显示签名对话框
 */
SignatureModal.show = properties => {
  const _props = properties || {}
  _props.visible = true

  const Instance = new Vue({
    store,
    render(h) {
      return h(SignatureModal, {
        props: Object.assign({}, _props)
      })
    }
  })

  const component = Instance.$mount()
  document.body.appendChild(component.$el)
  const modal = Instance.$children[0]

  return {
    component: modal
  }
}

export default SignatureModal
