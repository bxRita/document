import { cloneDeep } from 'lodash'

/*
 * 根据属性类型 生成属性栏
 * FilePath: \src\views\design\module\right\generate-props.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-12 09:24:23
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
export function createItem(h, item, vm) {
  let renderDom = null
  switch (item.type) {
    case 'input':
      renderDom = (
        <a-input
          defaultValue={vm.handlerData(item.id, 'get')}
          size="small"
          placeholder={item.placeholder || '请输入'}
          disabled={
            item.options && item.options.disabled !== undefined
              ? item.options.disabled
              : false
          }
          on-change={value => {
            vm.handlerData({ id: item.id, value }, 'set')
          }}
        >
          {item.unit && <template slot="append">{item.unit}</template>}
        </a-input>
      )
      break
    case 'select':
      renderDom = (
        <a-select
          defaultValue={vm.handlerData(item.id, 'get')}
          size="small"
          on-change={value => {
            vm.handlerData({ id: item.id, value }, 'set')
          }}
        >
          {item.list.map((opt, index) => {
            return (
              <a-select-option key={index} value={opt.value}>
                {opt.label}
              </a-select-option>
            )
          })}
        </a-select>
      )
      break
    case 'inputNumber':
      renderDom = (
        <a-input-number
          size="small"
          style="width: 100%"
          placeholder="请输入"
          defaultValue={vm.handlerData(item.id, 'get')}
          disabled={
            item.options && item.options.disabled !== undefined
              ? item.options.disabled
              : false
          }
          min={
            item.options &&
            item.options.min !== void 0 &&
            item.options.min !== null
              ? item.options.min
              : 0
          }
          max={
            item.options &&
            item.options.max !== void 0 &&
            item.options.max !== null
              ? item.options.max
              : Number.MAX_SAFE_INTEGER
          }
          on-change={value => {
            vm.handlerData({ id: item.id, value }, 'set')
          }}
        />
      )
      break
    case 'switch':
      renderDom = (
        <a-switch
          size="small"
          checked-children={item.activeText}
          un-checked-children={item.inactiveText}
          defaultChecked={vm.handlerData(item.id, 'get')}
          on-change={value => {
            vm.handlerData({ id: item.id, value }, 'set')
          }}
        />
      )
      break
    case 'chartStyleSetting':
      renderDom = (
        <div class="style-setting">
          <a-button size="small" type="primary">
            图表样式设置
          </a-button>
        </div>
      )
      break
    case 'selectOption': // select 下拉框 静态数据添加
      renderDom = (
        <StaticDataOption
          options={vm.currentWidget.props.options}
          propId={item.id}
          widgetId={vm.currentWidget.id}
        ></StaticDataOption>
      )

      break
    case 'dynamicCfg': // 动态数据源
      renderDom = (
        <DynamicUrl
          widgetProps={cloneDeep(vm.currentWidget.props)}
          on-change={value => {
            vm.handlerData({ id: item.id, value }, 'set')
          }}
        ></DynamicUrl>
      )

      break
    case 'padding':
      renderDom = <span style="font-size:12px">--</span>
      break
    case 'title':
      renderDom = <span class="attributs-setting__title">{item.label} :</span>
      break
    case 'tips':
      renderDom = <span class="attributs-setting__tips">{item.label}</span>
      break
    case 'custom':
      renderDom = item.render(h, vm)
      break
    default:
      break
  }
  return renderDom
}
