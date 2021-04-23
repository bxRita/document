<!--
  FilePath: \src\components\chart\charts-map.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 16:36:00
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import chartsMixins from '@/mixins/chartsMixins'
import chinaJson from './china.json'
import { WidgetComponentName } from '@/constants'
// 地图
export default {
  name: WidgetComponentName.ECHARTS_MAP,

  mixins: [chartsMixins],

  methods: {
    init() {
      this.echartsBase.registerMap(chinaJson)
      this.echartsBase.load(
        {
          series: [
            {
              type: 'map',
              map: 'china'
            }
          ]
        },
        document.querySelector('#' + this.record.id),
        this.options.chartTheme
      )
    }
  },
  render(h) {
    return (
      <div class="xa-echarts-map" style={this.styles} id={this.record.id}></div>
    )
  }
}
</script>
