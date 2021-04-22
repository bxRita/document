/*
 * FilePath: \src\mixins\layoutMixins.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-09 11:13:28
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import basisMixins from './basisMixins'
import draggable from 'vuedraggable'
import layoutItem from '@/views/design/module/LayoutItem.vue'

export default {
  mixins: [basisMixins],
  components: {
    draggable,
    layoutItem
  },
  props: {
    isRuntime: {
      type: Boolean,
      default: false
    },
    selectItem: {
      type: Object,
      default: () => {}
    },
    config: {
      type: Object,
      required: false
    },
    insertAllowedType: {
      type: Array,
      required: false
    },
    hideModel: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentWidgetId() {
      return (this.selectItem && this.selectItem.id) || null
    }
  },
  methods: {
    addSubWidget(...args) {
      this.$emit('addSubWidget', ...args)
    },
    /**
     * @description 选中元素
     */
    handleSelectItem(record) {
      this.$emit('handleSelectItem', record)
    },
    /**
     * @description 添加列
     */
    handleColAdd(e, list) {
      this.$emit('handleColAdd', e, list)
    }
  }
}
