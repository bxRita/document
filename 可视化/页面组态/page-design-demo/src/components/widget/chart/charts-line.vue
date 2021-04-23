<!--
  FilePath: \src\components\chart\charts-line.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 15:55:55
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->
<script>
import { WidgetComponentName } from '@/constants'
import chartsMixins from '@/mixins/chartsMixins'
// 折线图
export default {
  name: WidgetComponentName.ECHARTS_LINE,

  mixins: [chartsMixins],

  render(h) {
    return (
      <div
        class="xa-echarts-line"
        style={this.styles}
        id={this.record.id}
      ></div>
    )
  }
}
</script>
