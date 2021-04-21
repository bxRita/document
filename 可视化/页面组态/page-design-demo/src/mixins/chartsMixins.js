/*
 * FilePath: \src\mixins\chartsMixins.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-15 15:56:37
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
import basisMixins from './basisMixins'
import EchartsBase from '@/modules/echartBase.module'
import { throttle } from '@/utils/tools'
import { cloneDeep } from 'lodash'
import { isEqual } from 'lodash'

let _this = null

export default {
  mixins: [basisMixins],

  computed: {
    styles() {
      return {
        width: this.custom.width + 'px',
        height: this.custom.height + 'px',
        display: this.show ? 'block' : 'none'
      }
    },
    echartsBase() {
      return new EchartsBase()
    }
  },

  watch: {
    'options.chartConfig': {
      handler(newValue, oldValue) {
        if (!isEqual(newValue, oldValue)) {
          this.echartsBase.setOption(newValue)
        }
      },
      deep: true
    },
    'custom.width': {
      handler() {
        this.resize()
      }
    },
    'custom.height': {
      handler() {
        this.resize()
      }
    }
  },

  mounted() {
    _this = this
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      this.echartsBase.load(
        cloneDeep(this.options.chartConfig),
        document.querySelector('#' + this.record.id),
        this.options.chartTheme
      )
    },
    resize: throttle(() => {
      _this.echartsBase.resize()
    }, 500)
  }
}
