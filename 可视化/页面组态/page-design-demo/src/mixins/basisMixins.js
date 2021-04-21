/*
 * FilePath: \src\mixins\basisMixins.js
 * Project: page-design-demo
 * CreatedAt: 2021-04-09 10:08:42
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */
// 组件公用代码块
export default {
  props: {
    record: Object,
    options: Object,
    custom: {
      type: Object,
      default() {
        return {
          eventListener: {}
        }
      }
    }
  },

  data() {
    return {
      show: true, // 显示隐藏
      // 联动事件返回值数据栈
      // 严格按照配置的联动事件顺序来存储数据
      linkageEventBackValueStack: []
    }
  },

  computed: {
    styles() {
      return {
        // width: '100%',
        // height: '100%',
        display: this.show ? 'block' : 'none'
      }
    }
  },

  methods: {
    /**
     * 联动事件处理函数
     * @param {String} eventName 事件名
     * @param  {...any} arg 事件触发参数
     * @returns
     */
    linkageEventFunctionHandler: async function (eventName, ...arg) {
      let i = -1
      let items = Object.keys(this.custom.eventListener).filter(
        item => item.indexOf(`${eventName}$$`) > -1
      )
      let len = items.length
      this.linkageEventBackValueStack = []
      while (++i < len) {
        let item = items[i]
        let levels = item.split('$$')
        let refs = window.Uidesigner.$refs
        levels.shift()

        let componentId = levels[0]
        let componentEventhandlerName = levels[1]

        // 根据配置调用对应组件函数
        if (
          refs[componentId] &&
          typeof refs[componentId][componentEventhandlerName] === 'function'
        ) {
          let result = await this.custom.eventListener[item](this)
          let backValue = refs[componentId][componentEventhandlerName](
            ...arg,
            result
          )

          if (typeof backValue !== undefined) {
            // 执行联动事件后如果有返回值,存储当前返回值，
            // 如果下一个联动事件需要用到上一次的值可以在当前执行函数参数里面拿到当前组件实例
            // 联动函数默认第一个参数是当前组件实例对象
            this.linkageEventBackValueStack.push(backValue)
          }
        }
      }

      return this.linkageEventBackValueStack
    },
    // 组件事件处理函数
    eventFunctionHandler(eventName, ...arg) {
      if (!eventName) return
      console.log(`eventHandle ${eventName} params: `, arg)
      let execFun = this.custom.eventListener[eventName]
      if (execFun && typeof execFun == 'string') {
        execFun = new Function(`return ${execFun}`)()
      }
      execFun && execFun(this, ...arg)

      this.linkageEventFunctionHandler(eventName, ...arg)
    },
    // 设置组件显示隐藏
    setDisplay(show) {
      this.show = !this.show
    },
    setDisabled() {
      this.options.disabled = true
    }
  },

  created() {
    try {
      if (
        this.custom &&
        this.custom.eventListener &&
        Object.keys(this.custom.eventListener).length
      ) {
        Object.keys(this.custom.eventListener).forEach(item => {
          if (typeof this.custom.eventListener[item] === 'string') {
            this.custom.eventListener[item] = new Function(
              `return ${this.custom.eventListener[item]}`
            )()
          }
        })
      }

      this.custom.eventListener.created &&
        this.custom.eventListener.created(this)
      this.linkageEventFunctionHandler('created')
    } catch (error) {
      console.error(error)
    }
  },

  mounted() {
    this.custom.eventListener.mounted && this.custom.eventListener.mounted(this)
    this.linkageEventFunctionHandler('mounted')
    // 绑定自定义事件必须延迟支持，因为需要图表组件初始化完成后才能拿到图表实例
    setTimeout(() => {
      // 可以在cstomEvent函数绑定自定义事件
      // 比如图表组件的事件处理
      // 具体事件处理函数可以参考https://echarts.apache.org/zh/api.html#events文档
      /*
      currentComponentInstance.echartsBase.getEcharsInstance() 获取chart实例对象

      currentComponentInstance.echartsBase.getEcharsInstance().on('click', function(params) {
        console.log(params);
      });

      currentComponentInstance.echartsBase.getEcharsInstance().on('legendselectchanged', function(params) {
        console.log(params);
      });

      currentComponentInstance.echartsBase.getEcharsInstance().on('click', 'series.line', function(params) {
        console.log(params);
      });

      currentComponentInstance.echartsBase.getEcharsInstance().on('mouseover', { seriesIndex: 1, name: 'xx' }, function(params) {
        console.log(params);
      });
      */
      this.custom.eventListener.customEvent &&
        this.custom.eventListener.customEvent(this)
    }, 100)
  }
}
