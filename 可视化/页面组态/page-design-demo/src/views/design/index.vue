<!--
  FilePath: \src\views\design\index.vue
  Project: page-design-demo
  CreatedAt: 2021-04-06 16:40:55
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <a-layout>
    <!-- <a-layout-header>header</a-layout-header> -->
    <a-layout class="content">
      <a-layout-sider class="left">
        <left-component></left-component>
      </a-layout-sider>
      <a-layout-content :style="contentStyle">
        <operate-area
          :showToolbarsText="showToolbarsText"
          :toolbars="toolbars"
          @handleSave="handleSave"
          @handlePreview="handlePreview"
          @handleOpenImportJsonModal="handleOpenImportJsonModal"
          @handleOpenCodeModal="handleOpenCodeModal"
          @handleOpenJsonModal="handleOpenJsonModal"
          @handleReset="resetDesignPanel"
          @handleClose="handleClose"
        ></operate-area>
        <design-panel
          :designData="designData"
          :selectItem="selectItem"
        ></design-panel>
      </a-layout-content>
      <a-layout-sider width="350" class="right">
        <right-prop-area :currentSelectItem="currentItem"></right-prop-area>
      </a-layout-sider>
    </a-layout>
    <!-- <a-layout-footer>copy right@2021</a-layout-footer> -->
  </a-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import './index.less'
import OperateArea from './module/OperateArea.vue'
import LeftComponent from './module/LeftComponent.vue'
import DesignPanel from './module/DesignPanel.vue'
import RightPropArea from './module/RightPropArea.vue'
import { cloneDeep } from 'lodash'
import { LocalPageDataKey } from '@/constants'
export default {
  name: 'Design',
  inheritAttrs: false,
  components: {
    OperateArea,
    LeftComponent,
    DesignPanel,
    RightPropArea
  },
  props: {
    showToolbarsText: {
      type: Boolean,
      default: false
    },
    toolbars: {
      type: Array,
      default: () => [
        'save',
        'preview',
        'exportJson',
        'exportCode',
        'reset',
        'close'
      ]
    }
  },
  data() {
    return {
      // data: {
      //   list: [],
      //   config: {
      //     layout: 'horizontal',
      //     labelCol: { xs: 4, sm: 4, md: 4, lg: 4, xl: 4, xxl: 4 },
      //     wrapperCol: { xs: 18, sm: 18, md: 18, lg: 18, xl: 18, xxl: 18 },
      //     hideRequiredMark: false,
      //     customStyle: ''
      //   }
      // },
      selectItem: {
        key: ''
      },
      contentStyle: {
        height: '300px'
      }
    }
  },
  computed: {
    ...mapGetters('design', ['pageData', 'currentSelectItem']),
    designData() {
      return cloneDeep(this.pageData)
    },
    currentItem() {
      let curItem = this.currentSelectItem
      return cloneDeep(curItem)
    }
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions('design', ['resetDesignPanel']),
    init() {
      const clientH = document.body.clientHeight,
        contentH = clientH - 3

      this.contentStyle.height = `${contentH}px`
    },
    saveDataToLocal() {
      let cloneData = cloneDeep(this.pageData)
      // 保存的数据中 删除右侧属性栏options的配置项
      const handleOption = list => {
        list.forEach(l => {
          if (l.subProp) {
            handleOption(l[l.subProp])
          }
          if (l.list) {
            handleOption(l.list)
          }
          if (l.options) delete l.options
        })
      }

      handleOption(cloneData.list)
      // 将处理后的数据 保存到localstorage中
      localStorage.setItem(LocalPageDataKey, JSON.stringify(cloneData))
    },
    handleSave() {
      this.saveDataToLocal()
      this.$message.success('保存成功')
    },
    handlePreview() {
      this.saveDataToLocal()
      // 打开预览界面
      window.open('/preview')
    },
    handleOpenImportJsonModal() {},
    handleOpenCodeModal() {},
    handleOpenJsonModal() {},
    handleClose() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.ant-layout {
  .ant-layout-header {
    background: none;
  }
  .ant-layout.ant-layout-has-sider {
    main {
      margin: 0 8px 0;
      box-shadow: 0px 0px 1px 1px #ccc;
      border-bottom: 1px solid #ccc;
    }
    .ant-layout-sider {
      background: none;
      box-shadow: 0px 0px 1px 1px #ccc;
    }
    .left,
    .right {
      height: 100%;
      overflow: auto;
    }
  }
}
</style>
