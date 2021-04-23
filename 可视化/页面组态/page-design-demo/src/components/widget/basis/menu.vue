<!--
  FilePath: \src\components\widget\basis\menu.vue
  Project: page-design-demo
  CreatedAt: 2021-04-20 15:02:38
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import basisMixins from '@/mixins/basisMixins'
import dynamicDataMixins from '@/mixins/dynamicDataMixins'
import { cloneDeep } from 'lodash'
import { transArrToTree } from '@/utils/tools'
import { WidgetComponentName } from '@/constants'
export default {
  name: WidgetComponentName.MENU,
  inheritAttrs: false,
  mixins: [basisMixins, dynamicDataMixins],
  methods: {
    clickEvent(...args) {
      this.eventFunctionHandler('click', ...args)
    },
    selectEvent(...args) {
      this.eventFunctionHandler('select', ...args)
    },
    openChangeEvent(...args) {
      this.eventFunctionHandler('openChange', ...args)
    },
    deselectEvent(...args) {
      this.eventFunctionHandler('deselect', ...args)
    },
    createMenuItem(item) {
      return (
        <a-menu-item key={item.value}>
          {item.icon && <a-icon type={item.icon} />}
          <span>{item.label}</span>
        </a-menu-item>
      )
    },
    createChildComp(h) {
      let data = this.optionList
      const { dynamicCfg } = this.options
      const { parentKey, topParentVal, valueField } = dynamicCfg
      let result = transArrToTree(
        cloneDeep(data),
        parentKey,
        valueField,
        topParentVal
      )

      const handler = arr => {
        let temp = arr.map(item => {
          if (item.children) {
            return (
              <a-sub-menu key={item.value}>
                <span slot="title">
                  {item.icon && <a-icon type={item.icon} />}
                  <span>{item.label}</span>
                </span>
                {handler(item.children)}
              </a-sub-menu>
            )
          } else {
            return this.createMenuItem(item)
          }
        })
        return temp
      }

      let r = handler(result)

      return r
    }
  },
  render(h) {
    return (
      <a-menu
        style={this.styles}
        onClick={this.clickEvent}
        onDeselect={this.deselectEvent}
        onSelect={this.selectEvent}
        onOpenChange={this.openChangeEvent}
        mode={this.options.mode}
        multiple={this.options.multiple}
        selectable={this.options.selectable}
        theme={this.options.theme}
        defaultOpenKeys={this.options.defaultOpenKeys}
        defaultSelectedKeys={this.options.defaultSelectedKeys}
        inlineIndent={this.options.inlineIndent}
      >
        {this.createChildComp(h)}
      </a-menu>
    )
  }
}
</script>
