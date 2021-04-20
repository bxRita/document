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
import pluginChartsMixins from '@/mixins/chartsMixins'
// 折线图
export default {
  name: 'xaEchartsLine',

  mixins: [pluginChartsMixins],

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
