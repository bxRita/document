<!--
  FilePath: \src\components\chart\charts-gauge.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 17:03:00
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import { WidgetComponentName } from '@/constants'
import chartsMixins from '@/mixins/chartsMixins'

// 仪表盘
export default {
  name: WidgetComponentName.ECHARTS_GAUGE,

  mixins: [chartsMixins],

  render(h) {
    return (
      <div
        class="xa-echarts-gauge"
        style={this.styles}
        id={this.record.id}
      ></div>
    )
  }
}
</script>
