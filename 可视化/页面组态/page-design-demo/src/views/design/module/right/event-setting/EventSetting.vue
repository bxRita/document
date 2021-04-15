<!--
  组件事件信息配置
  FilePath: \src\views\design\module\right\EventSetting.vue
  Project: page-design-demo
  CreatedAt: 2021-04-11 16:00:55
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<template>
  <div class="event-setting">
    <!--组件事件配置-->
    <div class="event-setting-title">添加组件事件处理函数:</div>
    <div class="event-setting-select">
      <a-dropdown
        v-if="componentsEvents.length > 0"
        placement="bottomLeft"
        :trigger="['click']"
      >
        <a-button>组件事件</a-button>
        <a-menu slot="overlay" class="event-setting-dropdown">
          <a-menu-item
            v-for="item in componentsEvents"
            :key="item.eventName"
            :disabled="
              eventData.filter(
                eventDataItem => eventDataItem.eventName === item.eventName
              ).length > 0
            "
            @click.native="selectEvent(item)"
          >
            <div class="event-setting-dropdown-item">
              <span>{{ item.eventName }}</span>
              <span class="event-setting-des">{{ item.eventDes }}</span>
            </div>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <div class="event-setting-list">
      <a-table
        :data-source="eventData"
        :columns="eventColumns"
        rowKey="eventName"
      >
        <template slot="name" slot-scope="text, record">
          <div class="event-setting-dropdown-item">
            <span>{{ text }}</span>
            <span class="event-setting-des">{{
              componentsEventsObj[record.eventName].eventDes
            }}</span>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="editEventCode(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="您确定删除该事件吗？"
            @onConfirm="handleDel(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>
    <!--联动事件配置-->
    <div class="event-setting-title">添加组件联动事件:</div>
    <div class="event-setting-select">
      <a-button @click="openLinkageEventSetting">组件联动事件</a-button>
    </div>
    <div class="event-setting-list">
      <a-table
        :data-source="linkageEventData"
        :columns="eventLinkColumns"
        rowKey="eventName"
        border
      >
        <template slot="name" slot-scope="text, record">
          <div class="event-setting-dropdown-item">
            <span>{{ text }}</span>
            <span class="event-setting-des">{{
              componentsEventsObj[record.eventName].eventDes
            }}</span>
          </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <a @click="editEventCode(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm
            title="您确定删除该事件吗？"
            @onConfirm="handleDel(record)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </div>

    <a-drawer
      title="事件回调函数在线编辑"
      :visible.sync="drawer"
      placement="right"
      :maskClosable="true"
      :mask="false"
      width="800px"
      custom-class="event-setting-code-edit"
      @close="handleClose"
    >
      <CodeEditor
        v-if="drawer"
        ref="codeEditorRef"
        :codeContent="currentEvent.eventCallBack.toString()"
        language="javascript"
        type="[object Function]"
      />
    </a-drawer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { types } from '@/utils/tools'
import EventSetting from './eventSetting.module'

let eventSettingIns = null

export default {
  name: 'EventSetting',
  inheritAttrs: false,
  props: {
    currentWidget: Object
  },
  watch: {
    'currentWidget.custom.eventConfig': {
      handler() {
        this.init()
        if (
          this.currentWidget &&
          this.currentWidget.custom &&
          this.currentWidget.custom.eventConfig
        ) {
          this.createEventConfig()
        }
      },
      immediate: true
    },
    'currentWidget.custom.eventListener': {
      handler() {
        if (
          this.currentWidget &&
          this.currentWidget.custom &&
          this.currentWidget.custom.eventListener
        ) {
          eventSettingIns.updateEventListener(
            this.currentWidget.custom.eventListener
          )
          this.createEventListener()
        }
      },
      immediate: true
    }
  },

  computed: {
    pagePulgin() {
      // 过滤联动组件,联动事件无法联动自己
      return this.$store.state.plugins.filter(
        item => item.id !== this.currentWidget.id
      )
    },
    linkageEventLevel() {
      let _currentLinkageEvent = [...this.currentLinkageEvent]
      _currentLinkageEvent.length > 2 && _currentLinkageEvent.pop()
      return _currentLinkageEvent.join(' & ')
    }
  },

  data() {
    return {
      eventColumns: [
        {
          title: '已有事件',
          dataIndex: 'eventName',
          width: '70%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      eventLinkColumns: [
        {
          title: '联动事件',
          dataIndex: 'eventName',
          width: '70%',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      drawer: false,
      componentsEvents: [],
      linkageEvents: [],
      eventData: [],
      currentEvent: {},
      currentLinkageEvent: [],
      componentsEventsObj: {},
      linkageEventData: [],
      pageDialogOptions: {
        title: '组件联动事件配置',
        classname: 'event-setting-dialog'
      },
      linkageEventSettingActiveIndex: 0,
      linkageEventConfig: [],
      openLinkageEventDialog: false
    }
  },
  beforeCreate() {
    eventSettingIns = new EventSetting()
  },
  mounted() {},
  methods: {
    ...mapActions('design', ['updateWidgetEvent']),
    init() {
      this.componentsEvents = []
      this.eventData = []
      this.currentEvent = {}
    },
    createEventConfig() {
      let _linkageEvents = []
      let _componentsEvents = []
      let _componentsEventsObj = {}

      this.currentWidget.custom.eventConfig.forEach(item => {
        // 1: 组件事件 2: 原生事件  3:自定义事件
        if (['1', '3'].includes(item.eventType)) {
          _componentsEvents.push(item)
        }
        if (['1'].includes(item.eventType)) {
          _linkageEvents.push(item)
        }
        _componentsEventsObj[item.eventName] = Object.assign({}, item)
      })

      this.componentsEvents = _componentsEvents.slice(0)
      this.linkageEvents = _linkageEvents.slice(0)
      this.componentsEventsObj = Object.assign({}, _componentsEventsObj)
    },
    createEventListener() {
      const {
        eventData,
        linkageEventData
      } = eventSettingIns.createEventListener()

      this.eventData = eventData.slice(0)
      this.linkageEventData = linkageEventData.slice(0)
    },
    handleDel(row) {
      this.updateWidgetEvent({
        widgetId: this.currentWidget.id,
        modify: {
          id: 'custom.eventListener',
          value: eventSettingIns.delEventListener(row.eventName).eventListener
        }
      })
    },
    selectEvent(item) {
      if (!this.drawer) this.drawer = true
      this.currentEvent = eventSettingIns.createEventFunction(item)
    },
    handleClose() {
      const codeValue = this.$refs.codeEditorRef.getValue()
      const _this = this
      const saveCode = () => {
        this.$confirm({
          title: '确认是否保存并关闭?',
          content: '点击ok：保存并关闭；点击cancel：关闭不保存',
          onOk() {
            if (types(codeValue) === '[object Error]') {
              _this.$notification['error']({
                message: '错误',
                description: '代码存在语法错误!'
              })
            } else {
              _this.openLinkageEventDialog
                ? _this.saveLinkageCompoentEventCode(codeValue)
                : _this.saveComponentEventCode(codeValue)
              _this.drawer = false
              _this.currentEvent = {}
            }
          },
          onCancel() {
            _this.drawer = false
          }
        })
      }
      // 如果当前事件函数存在值并且已经绑定过函数,判断两个值是否相同,如果相同不更新数据反之进行保存
      eventSettingIns.diffEventListenerCode(
        codeValue,
        this.currentEvent.eventName
      )
        ? saveCode()
        : (this.drawer = false)
    },
    saveEventCode() {
      this.updateWidgetEvent({
        widgetId: this.currentWidget.id,
        modify: {
          id: 'custom.eventListener',
          value: eventSettingIns.eventListener
        }
      })
    },
    saveComponentEventCode(codeValue) {
      eventSettingIns.updateEventListener(
        this.currentEvent.eventName,
        codeValue
      )
      this.saveEventCode()
    },
    saveLinkageCompoentEventCode(codeValue) {
      eventSettingIns.updateEventListener(
        this.currentEvent.eventName,
        codeValue
      )
      this.updateLinkageEventConfigCheck(this.linkageEventConfig)
    },
    editEventCode(row) {
      if (!this.drawer) this.drawer = true
      this.currentEvent = Object.assign({}, row)
    },
    resetDialogData() {
      this.linkageEventSettingActiveIndex = 0
      eventSettingIns.setLinkageEventLevel()
      this.currentLinkageEvent = []
      this.openLinkageEventDialog = false
    },
    openLinkageEventSetting() {
      // this.$refs.pageDialogViewRef.showDialog()
      // this.openLinkageEventDialog = true
    },
    cancelDialogFn() {
      this.resetDialogData()
    },
    confirmDialogFn() {
      this.saveEventCode()
      this.resetDialogData()
    },
    previous() {
      if (this.linkageEventSettingActiveIndex > 0) {
        this.linkageEventSettingActiveIndex--
      }
    },
    next() {
      if (this.linkageEventSettingActiveIndex <= 1) {
        this.linkageEventSettingActiveIndex++
      }
    },
    selectComponentEvent(item) {
      eventSettingIns.setLinkageEventLevel(item.eventName, 0)
      this.currentLinkageEvent = [...eventSettingIns.linkageEventLevel]
      this.next()
    },
    selectLinkageComponent(item) {
      eventSettingIns.setLinkageEventLevel(item.id, 1)
      this.currentLinkageEvent = [...eventSettingIns.linkageEventLevel]
      // 获取联动组件对应数据配置
      let linkageEventConfig = this.pagePulgin.find(
        pluginItem => pluginItem.id === item.id
      ).custom.linkageEventConfig
      this.updateLinkageEventConfigCheck(linkageEventConfig)
      this.next()
    },
    selectLinkageComponentEventType(item) {
      let currentEvent = eventSettingIns.setLinkageEventLevel(item.id, 2)

      if (currentEvent) {
        if (!this.drawer) this.drawer = true
        this.currentEvent = currentEvent
      }

      this.currentLinkageEvent = eventSettingIns.linkageEventLevel
    },
    updateLinkageEventConfigCheck(linkageEventConfig) {
      let findLinkageEventData = eventSettingIns.findLinkageEvent()
      linkageEventConfig.map(
        linkageEventItem =>
          (linkageEventItem['checked'] =
            findLinkageEventData.indexOf(linkageEventItem.id) > -1)
      )
      this.linkageEventConfig = [...linkageEventConfig]
    }
  }
}
</script>

<style lang="less">
.event-setting {
  &-title {
    display: inline-block;
    width: 100%;
    border-bottom: 2px solid #0087ee;
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 10px;
  }
  &-select {
    display: flex;
    justify-content: space-between;
    align-content: center;
    .a-dropdown {
      flex: 1;
      .a-button--mini {
        width: 100%;
        border-radius: 0;
      }
    }
    .a-dropdown:nth-of-type(2) {
      .a-button--mini {
        border-left: 0px;
      }
    }
    .a-button--mini {
      width: 100%;
      border-radius: 0;
    }
  }
  &-dropdown {
    min-width: 276px;
    max-height: 60vh;
    overflow: auto;
    &-item {
      display: flex;
      justify-content: space-between;
      align-content: center;
      align-items: center;
    }
  }
  &-des {
    color: #909090;
    font-size: 12px;
  }
  &-list {
    margin-top: 20px;
    margin-bottom: 20px;
    &-table-des {
      font-size: 12px;
      color: #9e9e9e;
      font-weight: 500;
    }
    .a-cascader {
      width: 100%;
    }
  }
  &-code-edit {
    .a-drawer__header {
      margin-bottom: 0;
      padding: 10px;
    }
  }
  &-dialog {
    .linkage-dialog-title {
      display: flex;
      justify-content: flex-start;
      align-content: center;
      padding: 20px 0 5px 0;
      font-size: 14px;
    }
    .linkage-dialog-tool {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-top: 20px;
      padding: 0 10px;
    }
    .linkage-dialog-content {
      max-height: 50vh;
      overflow-y: auto;
      border: 1px dashed #dcdfe6;
      margin-top: 10px;
    }
    .linkage-dialog-event {
      margin: 0;
      padding: 20px 10px;
      &-actived {
        color: #ffffff !important;
        background-color: #f0f9eb !important;
        color: #67c23a !important;
      }
      &-checked {
        background-color: #f0f9eb !important;
        color: #67c23a !important;
      }
      li {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        border: 1px solid #dcdfe6;
        margin-bottom: 10px;
        cursor: pointer;
        &:hover {
          border-color: #0087ee;
          border-style: dashed;
        }
      }
    }
  }
}
</style>
