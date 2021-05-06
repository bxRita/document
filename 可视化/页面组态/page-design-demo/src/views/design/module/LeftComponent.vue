<!--
  FilePath: \src\views\design\module\LeftComponent.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 09:51:04
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-collapse
    @change="collapseChange"
    :defaultActiveKey="collapseDefaultActiveKey"
  >
    <!-- 基础控件 start -->
    <a-collapse-panel
      :header="comp.title"
      v-for="(comp, name) in componentMap"
      :key="name"
    >
      <collapseItem
        :list="comp.list"
        @generateKey="generateKey"
        @handleListPush="handleListPush"
        @start="handleStart"
      />
    </a-collapse-panel>
    <!-- 基础控件 end -->
  </a-collapse>
</template>

<script>
import { mapActions } from 'vuex'
import CollapseItem from './CollapseItem'
import Configuration from '@/configuration/Configuration'
import { generateId } from '@/utils/tools'
import { cloneDeep } from 'lodash'
import { WidgetType } from '@/constants'
export default {
  name: 'LeftComponent',
  inheritAttrs: false,
  components: {
    CollapseItem
  },
  data() {
    return {
      componentMap: {
        [WidgetType.basis]: {
          title: '基础控件',
          list: []
        },
        [WidgetType.layout]: {
          title: '容器控件',
          list: []
        },
        [WidgetType.chart]: {
          title: '图表控件',
          list: []
        }
      }
    }
  },
  created() {},
  computed: {
    collapseDefaultActiveKey() {
      // 计算当前展开的控件列表
      let defaultActiveKey = window.localStorage.getItem(
        'collapseDefaultActiveKey'
      )
      if (defaultActiveKey) {
        return defaultActiveKey.split(',')
      } else {
        return [WidgetType.basis]
      }
    }
  },

  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('design', ['addWidget']),
    init() {
      let componentConfig = new Configuration().getDefaultConfig()
      let basisMap = [],
        layoutMap = [],
        chartsMap = []
      componentConfig.map(item => {
        switch (item.type) {
          case WidgetType.basis:
            basisMap.push(item)
            break
          case WidgetType.layout:
            layoutMap.push(item)
            break
          case WidgetType.chart:
            chartsMap.push(item)
            break
          default:
            break
        }
      })
      this.componentMap.basis.list = basisMap
      this.componentMap.layout.list = layoutMap
      this.componentMap.chart.list = chartsMap
    },
    /**
     * @description 往设计面板中双击添加组件元素
     * @param {Object} item 待添加元素的默认配置
     */
    handleListPush(item) {
      let newWidget = cloneDeep(item)
      newWidget.id = generateId(item.key)
      this.addWidget(newWidget)
    },
    /**
     * @description 拖拽左侧组件到设计区  开始事件
     * @param {Object} widegetConfig 当前拖拽元素配置
     */
    handleStart(widgetConfig) {},
    /**
     * @description 拖拽开始生成 唯一key
     */
    generateKey(list, index) {
      // 生成key值
      const key = generateId(list[index].key)
      this.$set(list, index, {
        ...cloneDeep(list[index]),
        id: key
      })
    },
    /**
     * @description 左侧组件面板区  展开 折叠
     */
    collapseChange(val) {
      // 点击collapse时，保存当前collapse状态
      window.localStorage.setItem('collapseDefaultActiveKey', val)
    }
  }
}
</script>
