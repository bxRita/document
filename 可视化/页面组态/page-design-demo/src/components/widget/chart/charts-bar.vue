<!--
  FilePath: \src\components\chart\charts-bar.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 16:24:22
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import chartsMixins from '@/mixins/chartsMixins'
import { WidgetComponentName } from '@/constants'
// 柱状图
export default {
  name: WidgetComponentName.ECHARTS_BAR,

  mixins: [chartsMixins],

  render(h) {
    return (
      <div class="xa-echarts-bar" style={this.styles} id={this.record.id}></div>
    )
  }
}
</script>
