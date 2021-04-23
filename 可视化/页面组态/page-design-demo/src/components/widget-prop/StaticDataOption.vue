<!--
  FilePath: \src\components\widget-prop\StaticDataOption.vue
  Project: page-design-demo
  CreatedAt: 2021-04-16 14:56:09
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<script>
import { mapActions } from 'vuex'
import { uuid } from '@/utils/tools'
export default {
  name: 'StaticDataOption',
  inheritAttrs: false,
  components: {},
  props: {
    propId: String, // 组件属性id
    widgetId: String, // 组件id
    options: {
      // 静态数据源
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: this.options
    }
  },
  watch: {
    options: {
      handler: newVal => {
        this && (this.list = newVal)
      },
      deep: true
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions('design', [
      'addWidgetDataItem',
      'deleteWidgetDataItem',
      'updateWidgetDataItem'
    ]),
    /**
     * @description 增加数据项
     */
    addDataItem() {
      const uid = uuid()
      let newItem = {
        label: `选项${uid}`,
        value: uid
      }

      this.list.push(newItem)
      this.addWidgetDataItem({
        widgetId: this.widgetId,
        propId: this.propId,
        val: newItem
      })
    },
    /**
     * @description 删除数据项
     */
    deleteDataItem(idx) {
      this.list.splice(idx, 1)
      this.deleteWidgetDataItem({
        widgetId: this.widgetId,
        propId: this.propId,
        idx
      })
    },
    updateDataItem(propName, idx, event) {
      this.updateWidgetDataItem({
        widgetId: this.widgetId,
        propId: this.propId,
        propName,
        val: event.target.value,
        idx
      })
    }
  },
  render() {
    return (
      <div ref="datalist">
        <a-row>
          <a-col span={10}>值</a-col>
          <a-col span={10}>文本</a-col>
        </a-row>
        {this.list.map((opt, idx) => {
          return (
            <a-row>
              <a-col span={10}>
                <a-input
                  value={opt.value}
                  placeholder="请输入"
                  on-change={event => {
                    this.updateDataItem('value', idx, event)
                  }}
                  style="width:95%"
                />
              </a-col>
              <a-col span={10}>
                <a-input
                  value={opt.label}
                  placeholder="请输入"
                  style="width:95%"
                  on-change={event => {
                    this.updateDataItem('label', idx, event)
                  }}
                />
              </a-col>
              <a-col span={4}>
                <a-icon
                  type="delete"
                  on-click={() => {
                    this.deleteDataItem(idx)
                  }}
                />
              </a-col>
            </a-row>
          )
        })}
        <a
          on-click={() => {
            this.addDataItem()
          }}
        >
          添加项
        </a>
        <div>本地测试API:</div>
        <div>/api/pass/appResource/systemNameText</div>
        <div>/api/pass/workStations</div>
      </div>
    )
  }
}
</script>
