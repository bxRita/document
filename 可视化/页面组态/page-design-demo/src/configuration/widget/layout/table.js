/*
 * FilePath: \src\configuration\component\layout\table.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-09 11:21:35
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import layoutConfig from '@/configuration/common/layout'
import { WidgetComponentName } from '@/constants'
export const gridConfig = {
  type: layoutConfig.compType,
  key: WidgetComponentName.TABLE,
  icon: 'icon-biaoge',
  subProp: 'trs', // 包含子元素的属性名
  trs: [
    {
      subProp: 'tds', // 包含子元素的属性名
      tds: [
        {
          colspan: 1,
          rowspan: 1,
          list: []
        },
        {
          colspan: 1,
          rowspan: 1,
          list: []
        }
      ]
    },
    {
      subProp: 'tds', // 包含子元素的属性名
      tds: [
        {
          colspan: 1,
          rowspan: 1,
          list: []
        },
        {
          colspan: 1,
          rowspan: 1,
          list: []
        }
      ]
    }
  ],
  props: {
    width: '100%',
    bordered: true,
    bright: false,
    small: true,
    customStyle: ''
  },
  style: Object.assign({}, layoutConfig.style),
  custom: Object.assign({}, layoutConfig.custom, {
    name: '表格布局'
  }),
  options: [].concat(layoutConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.customStyle',
      label: '样式CSS',
      type: 'input'
    },
    {
      id: 'props.bordered',
      label: '显示边框',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.small',
      label: '紧凑型',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.bright',
      label: 'hover点亮',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'trs',
      label: '行列配置',
      type: 'custom',
      render: (h, vm) => {
        // 新增行
        function addTableRow(vm) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/addTableRow', {
            widgetId: curWidget.id
          })
        }
        // 新增列
        function addTableCol(vm) {
          let curWidget = vm.currentWidget
          vm.$store.dispatch('design/addTableCol', {
            widgetId: curWidget.id
          })
        }

        let dom = (
          <div>
            <a-row>
              <a-col span={10}>
                <a
                  on-click={() => {
                    addTableRow(vm)
                  }}
                >
                  添加行
                </a>
              </a-col>
              <a-col span={10}>
                <a
                  on-click={() => {
                    addTableCol(vm)
                  }}
                >
                  添加列
                </a>
              </a-col>
            </a-row>

            <br />
          </div>
        )
        return dom
      }
    }
  ])
}

export default gridConfig
