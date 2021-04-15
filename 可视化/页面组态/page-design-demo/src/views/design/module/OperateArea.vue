<!--
  FilePath: \src\views\design\module\OperateArea.vue
  Project: page-design-demo
  CreatedAt: 2021-04-08 09:17:50
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div class="operating-area">
    <!-- 头部操作按钮区域 start -->
    <!-- 操作左侧区域 start -->
    <div class="left-btn-box">
      <a-tooltip title="保存">
        <a v-if="toolbars.includes('save')" @click="$emit('handleSave')">
          <a-icon type="save" />
          <span v-if="showToolbarsText">保存</span>
        </a>
      </a-tooltip>

      <a-tooltip title="预览">
        <a v-if="toolbars.includes('preview')" @click="$emit('handlePreview')">
          <a-icon type="chrome" />
          <span v-if="showToolbarsText">预览</span>
        </a>
      </a-tooltip>

      <a-tooltip title="生成JSON">
        <a
          v-if="toolbars.includes('exportJson')"
          @click="$emit('handleOpenJsonModal')"
        >
          <a-icon type="credit-card" />
          <span v-if="showToolbarsText">生成JSON</span>
        </a>
      </a-tooltip>

      <a-tooltip title="生成代码">
        <a
          v-if="toolbars.includes('exportCode')"
          @click="$emit('handleOpenCodeModal')"
        >
          <a-icon type="code" />
          <span v-if="showToolbarsText">生成代码</span>
        </a>
      </a-tooltip>

      <a-tooltip title="清空">
        <a v-if="toolbars.includes('reset')" @click="$emit('handleReset')">
          <a-icon type="delete" />
          <span v-if="showToolbarsText">清空</span>
        </a>
      </a-tooltip>
      <!-- 按钮左侧插槽 start -->
      <slot name="left-action"></slot>
      <!-- 按钮左侧插槽 end -->
    </div>
    <!-- 操作左侧区域 end -->

    <!-- 操作右侧区域 start -->
    <div class="right-btn-box">
      <!-- 按钮右侧插槽 start -->
      <slot name="right-action"></slot>
      <!-- 按钮右侧插槽 end -->

      <a-tooltip title="关闭">
        <a v-if="toolbars.includes('close')" @click="$emit('handleClose')">
          <a-icon type="close" />
        </a>
      </a-tooltip>
    </div>
    <!-- 操作右侧区域 end -->

    <!-- 头部操作按钮区域 end -->
  </div>
  <!-- 操作区域 start -->
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
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
    },
    showToolbarsText: {
      type: Boolean,
      default: false
    }
  }
}
</script>
