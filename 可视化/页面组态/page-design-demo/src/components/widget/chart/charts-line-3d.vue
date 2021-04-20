<!--
  FilePath: \src\components\chart\charts-line-3d.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 16:30:54
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import pluginChartsMixins from '@/mixins/chartsMixins'

// 3D折线图
export default {
  name: 'xaEchartsLineD',

  mixins: [pluginChartsMixins],

  render(h) {
    return (
      <div
        class="xa-echarts-line-d"
        style={this.styles}
        id={this.record.id}
      ></div>
    )
  }
}
</script>
