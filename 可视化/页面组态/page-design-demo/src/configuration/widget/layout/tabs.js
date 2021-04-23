/*
 * FilePath: \src\configuration\component\layout\tabs.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-09 11:21:41
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import layoutConfig from '@/configuration/common/layout'
import { WidgetComponentName } from '@/constants'
export const gridConfig = {
  type: layoutConfig.compType,
  key: WidgetComponentName.TABS,
  icon: 'icon-tabs',
  subProp: 'columns', // 包含子元素的属性名
  columns: [
    {
      value: '1',
      label: '选项1',
      list: []
    },
    {
      value: '2',
      label: '选项2',
      list: []
    }
  ],
  props: {
    animated: true,
    size: 'default',
    tabPosition: 'top',
    type: 'line',
    tabBarGutter: null,
    defaultActiveKey: '1',
    activeKey: '1'
  },
  style: Object.assign({}, layoutConfig.style),
  custom: Object.assign({}, layoutConfig.custom, {
    name: '标签页',
    linkageEventConfig: [].concat(
      [
        {
          id: 'switchTabHandler',
          label: '切换Tab页签'
        }
      ],
      ...layoutConfig.custom.linkageEventConfig
    ),
    eventConfig: [].concat(
      [
        {
          eventType: '1', // 组件事件
          eventName: 'click',
          eventDes: '点击触发'
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
      id: 'props.defaultActiveKey',
      label: 'Tab值',
      type: 'input'
    },
    {
      id: 'props.animated',
      label: '动画切换',
      type: 'switch',
      activeText: '启用',
      inactiveText: '禁用'
    },
    {
      id: 'columns',
      label: '列配置项',
      type: 'custom',
      render: (h, vm) => {
        // 新增列
        function addTabCol(vm) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/addTabCol', {
            widgetId: curWidget.id
          })
        }
        // 删除列
        function deleteTabCol(idx, vm) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/deleteTabCol', {
            widgetId: curWidget.id,
            colIdx: idx
          })
        }
        // 更新列宽值
        function updateTabCol(event, idx, vm, propKey) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/updateTabProp', {
            widgetId: curWidget.id,
            colIdx: idx,
            val: event.target.value,
            propKey
          })
        }

        let curWidget = vm.currentWidget,
          cols = curWidget.columns
        let dom = (
          <div>
            <a-row gutter={5}>
              <a-col span={11}>唯一key</a-col>
              <a-col span={11}>名称</a-col>
              <a-col span={2}></a-col>
            </a-row>
            {cols.map((opt, idx) => {
              return (
                <a-row gutter={5}>
                  <a-col span={11}>
                    <a-input
                      value={opt.value}
                      placeholder="请输入"
                      on-change={value => {
                        updateTabCol(value, idx, vm, 'value')
                      }}
                    />
                  </a-col>
                  <a-col span={11}>
                    <a-input
                      value={opt.label}
                      placeholder="请输入"
                      on-change={value => {
                        updateTabCol(value, idx, vm, 'label')
                      }}
                    />
                  </a-col>
                  <a-col span={2}>
                    <a-icon
                      type="delete"
                      on-click={() => {
                        deleteTabCol(idx, vm)
                      }}
                    />
                  </a-col>
                </a-row>
              )
            })}
            <a
              on-click={() => {
                addTabCol(vm)
              }}
            >
              添加列
            </a>
          </div>
        )
        return dom
      }
    },
    {
      id: 'props.size',
      label: '页签大小',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'large',
          label: 'large '
        },
        {
          value: 'small',
          label: 'small'
        }
      ]
    },
    {
      id: 'props.tabPosition',
      label: '页签位置',
      type: 'select',
      list: [
        {
          value: 'top',
          label: 'top'
        },
        {
          value: 'right',
          label: 'right '
        },
        {
          value: 'bottom',
          label: 'bottom'
        },
        {
          value: 'left',
          label: 'left'
        }
      ]
    },
    {
      id: 'props.type',
      label: '页签样式',
      type: 'select',
      list: [
        {
          value: 'line',
          label: 'line'
        },
        {
          value: 'card',
          label: 'card '
        },
        {
          value: 'bottom',
          label: 'bottom'
        },
        {
          value: 'editable-card',
          label: 'editable-card'
        }
      ]
    },
    {
      id: 'props.tabBarGutter',
      label: 'Tab间隙',
      type: 'inputNumber',
      options: {
        min: 0,
        max: Number.MAX_SAFE_INTEGER
      }
    }
  ])
}

export default gridConfig
