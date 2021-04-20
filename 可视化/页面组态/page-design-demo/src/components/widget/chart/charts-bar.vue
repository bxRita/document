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
import pluginChartsMixins from '@/mixins/chartsMixins'

// 柱状图
export default {
  name: 'xaEchartsBar',

  mixins: [pluginChartsMixins],

  render(h) {
    return (
      <div class="xa-echarts-bar" style={this.styles} id={this.record.id}></div>
    )
  }
}
</script>
