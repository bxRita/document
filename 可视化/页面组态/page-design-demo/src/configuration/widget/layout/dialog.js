/*
 * FilePath: \src\configuration\component\layout\dialog.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-13 18:01:22
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import layoutConfig from '@/configuration/common/layout'
import { WidgetComponentName } from '@/constants'

export const gridConfig = {
  type: layoutConfig.compType,
  key: WidgetComponentName.DIALOG,
  icon: 'icon-qiapian',
  list: [],
  props: {
    isDesign: true,
    title: 'Dialog标题',
    width: '60%',
    cancelText: '取消',
    centered: false,
    closable: true,
    confirmLoading: false,
    destroyOnClose: false,
    keyboard: true,
    mask: false,
    maskClosable: true,
    okText: '确定',
    okType: 'primary',
    visible: false
  },
  style: Object.assign({}, layoutConfig.style),
  custom: Object.assign({}, layoutConfig.custom, {
    name: '弹框',
    linkageEventConfig: [].concat(
      [],
      ...layoutConfig.custom.linkageEventConfig
    ),
    eventConfig: [].concat(
      [
        {
          eventType: '1', // 组件事件
          eventName: 'ok',
          eventDes: '点击弹框确定'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'cancel',
          eventDes: '点击弹框取消'
        }
      ],
      ...layoutConfig.custom.eventConfig
    ),
    eventListener: {}
  }),
  options: [].concat(layoutConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.visible',
      label: '可见',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.title',
      label: '标题',
      type: 'input'
    },
    {
      id: 'props.width',
      label: '宽度',
      type: 'inputNumber'
    },
    {
      id: 'props.cancelText',
      label: '取消文本',
      type: 'input'
    },
    {
      id: 'props.okText',
      label: '确认文本',
      type: 'input'
    },
    {
      id: 'props.okType',
      label: '按钮类型',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'primary ',
          label: 'primary '
        },
        {
          value: 'dashed',
          label: 'dashed'
        },
        {
          value: 'danger',
          label: 'danger'
        },
        {
          value: 'link',
          label: 'link'
        }
      ]
    },
    {
      id: 'props.centered',
      label: '垂直居中',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.closable',
      label: '可关闭',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.confirmLoading',
      label: '确定loading',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.destroyOnClose',
      label: 'destroyOnClose',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.footer',
      label: '底部',
      type: 'input'
    },
    {
      id: 'props.keyboard',
      label: '支持esc关闭',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.mask',
      label: '展示遮罩',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.maskClosable',
      label: '遮罩允许关闭',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    }
  ])
}

export default gridConfig
