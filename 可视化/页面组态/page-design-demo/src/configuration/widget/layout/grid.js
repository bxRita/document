/*
 * 栅格布局
 * FilePath: \src\configuration\component\layout\row.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-08 10:33:06
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import layoutConfig from '@/configuration/common/layout'
import { WidgetComponentName } from '@/constants'
export const gridConfig = {
  type: layoutConfig.compType,
  key: WidgetComponentName.GRID,
  icon: 'icon-zhage',
  subProp: 'columns', // 包含子元素的属性名
  columns: [
    {
      span: 12,
      list: []
    },
    {
      span: 12,
      list: []
    }
  ],
  props: {
    gutter: 0,
    align: 'top',
    justify: 'start',
    type: null
  },
  style: Object.assign({}, layoutConfig.style),
  custom: Object.assign({}, layoutConfig.custom, {
    name: '栅格布局'
  }),
  options: [].concat(layoutConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.gutter',
      label: '栅格间距',
      type: 'inputNumber'
    },
    {
      id: 'columns',
      label: '列配置项',
      type: 'custom',
      render: (h, vm) => {
        // 新增列
        function addGridCol(vm) {
          let curWidget = vm.currentWidget
          let col = {
            span: 12,
            list: []
          }
          vm.$store.dispatch('design/addGridCol', {
            widgetId: curWidget.id,
            col
          })
        }
        // 删除列
        function deleteGridCol(idx, vm) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/deleteGridCol', {
            widgetId: curWidget.id,
            colIdx: idx
          })
        }
        // 更新列宽值
        function updateGridCol(val, idx, vm) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/updateGridColSpan', {
            widgetId: curWidget.id,
            colIdx: idx,
            val
          })
        }

        let curWidget = vm.currentWidget,
          cols = curWidget.columns
        let dom = (
          <div>
            {cols.map((opt, idx) => {
              return (
                <a-row>
                  <a-col span={20}>
                    <a-input-number
                      default-value={opt.span}
                      placeholder="请输入"
                      min={1}
                      max={24}
                      on-change={value => {
                        updateGridCol(value, idx, vm)
                      }}
                    />
                  </a-col>
                  <a-col span={4}>
                    <a-icon
                      type="delete"
                      on-click={() => {
                        deleteGridCol(idx, vm)
                      }}
                    />
                  </a-col>
                </a-row>
              )
            })}
            <a
              on-click={() => {
                addGridCol(vm)
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
      id: 'props.type',
      label: '布局模式',
      type: 'select',
      list: [
        {
          value: 'flex',
          label: 'flex '
        }
      ]
    },
    {
      id: 'props.align',
      label: 'flex垂直对齐',
      type: 'select',
      list: [
        {
          value: 'top',
          label: 'top'
        },
        {
          value: 'middle',
          label: 'middle '
        },
        {
          value: 'bottom',
          label: 'bottom'
        }
      ]
    },
    {
      id: 'props.justify',
      label: 'flex水平排列',
      type: 'select',
      list: [
        {
          value: 'start',
          label: 'start'
        },
        {
          value: 'end',
          label: 'end '
        },
        {
          value: 'center',
          label: 'center'
        },
        {
          value: 'space-around',
          label: 'space-around'
        },
        {
          value: 'space-between',
          label: 'space-between'
        }
      ]
    }
  ])
}

export default gridConfig
