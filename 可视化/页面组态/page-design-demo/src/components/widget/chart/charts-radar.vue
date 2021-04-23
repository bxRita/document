<!--
  FilePath: \src\components\chart\charts-radar.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 16:53:14
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import chartsMixins from '@/mixins/chartsMixins'
import { WidgetComponentName } from '@/constants'

// 雷达图
export default {
  name: WidgetComponentName.ECHARTS_RADAR,

  mixins: [chartsMixins],

  render(h) {
    return (
      <div
        class="xa-echarts-radar"
        style={this.styles}
        id={this.record.id}
      ></div>
    )
  }
}
</script>
