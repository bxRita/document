/*
 * FilePath: \src\configuration\widget\basis\datatable.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-21 17:20:06
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

import commonConfig from '@/configuration/common/basis'
import { cloneDeep } from 'lodash'
import { WidgetComponentName } from '@/constants'
export const buttonConfig = {
  type: commonConfig.compType,
  key: WidgetComponentName.DATATABLE,
  icon: 'icon-button-remove',
  props: {
    tableLayout: 'auto',
    bordered: false,
    columns: [
      {
        title: '名称',
        dataIndex: 'name',
        width: '20%'
      },
      {
        title: '编码',
        dataIndex: 'code',
        width: '20%'
      },
      {
        title: '邮箱',
        dataIndex: 'email'
      }
    ], //表格列的配置描述
    options: [
      // 静态数据
      {
        id: 1,
        name: 'Victoria Kelley',
        code: 'female',
        email: 'victoria.kelley@example.com'
      },
      {
        id: 2,
        name: 'Vegar Rostad',
        code: 'male',
        email: 'vegar.rostad@example.com'
      }
    ], // 数据源
    loading: false,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0
    },
    rowKey: 'id',
    showHeader: true, // 是否显示表头
    size: 'default',
    isDynamic: false, // 是否加载服务url数据
    dynamicCfg: {
      url: '/api/pass/workStations', // 服务url接口地址
      type: 'get',
      pageSize: 30,
      orderBy: null,
      orderDesc: false,
      chooseFields: 'data',
      valueField: 'value',
      labelField: 'label',
      params: []
    }
  },
  style: Object.assign({}, commonConfig.style),
  custom: Object.assign({}, commonConfig.custom, {
    name: '数据表',
    height: 50,
    width: 100,
    iconname: 'iconanniu',
    linkageEventConfig: [].concat(
      [
        {
          id: 'refreshTable',
          label: '表格刷新'
        }
      ],
      ...commonConfig.custom.linkageEventConfig
    ),
    eventConfig: [].concat(
      [
        {
          eventType: '1', // 组件事件
          eventName: 'change',
          eventDes: '分页、排序、筛选变化时触发'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'click',
          eventDes: '点击行'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'dblclick',
          eventDes: '双击行'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'mouseenter',
          eventDes: '鼠标移入行'
        },
        {
          eventType: '1', // 组件事件
          eventName: 'mouseleave',
          eventDes: '鼠标移出行'
        }
      ],
      ...commonConfig.custom.eventConfig
    ),
    eventListener: {}
  }),
  options: [].concat(commonConfig.options, [
    {
      label: '属性配置',
      type: 'title'
    },
    {
      id: 'props.rowKey',
      label: 'rowKey',
      type: 'input'
    },
    {
      id: 'props.loading',
      label: '加载中',
      type: 'switch',
      activeText: '启用',
      inactiveText: '禁用'
    },
    {
      id: 'props.bordered',
      label: '外边框',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.showHeader',
      label: '表格头',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.tableLayout',
      label: '布局',
      type: 'select',
      list: [
        {
          value: 'auto',
          label: '默认'
        },
        {
          value: 'fixed',
          label: 'fixed '
        }
      ]
    },
    {
      id: 'props.size',
      label: '表格大小',
      type: 'select',
      list: [
        {
          value: 'default',
          label: '默认'
        },
        {
          value: 'middle',
          label: 'middle'
        },
        {
          value: 'small',
          label: 'small'
        }
      ]
    },
    {
      id: 'props.pagination',
      label: '分页',
      type: 'custom',
      render(h, vm) {
        let curWidget = vm.currentWidget,
          ps = curWidget.props.pagination
        return (
          <ConfigPagination
            paginationInfo={ps}
            on-change={value => {
              vm.handlerData({ id: 'props.pagination', value }, 'set')
            }}
          ></ConfigPagination>
        )
      }
    },
    {
      id: 'props.columns',
      label: '列配置',
      type: 'custom',
      render(h, vm) {
        let curWidget = vm.currentWidget,
          colDefs = cloneDeep(curWidget.props.columns)
        return (
          <DataTableColumnConfig
            columnDefs={colDefs}
            on-change={value => {
              vm.handlerData({ id: 'props.columns', value }, 'set')
            }}
          ></DataTableColumnConfig>
        )
      }
    },
    {
      id: 'props.isDynamic',
      label: '动态加载',
      type: 'switch',
      activeText: '是',
      inactiveText: '否'
    },
    {
      id: 'props.dynamicCfg',
      label: '数据集',
      type: 'dynamicCfg'
    }
  ])
}

export default buttonConfig
