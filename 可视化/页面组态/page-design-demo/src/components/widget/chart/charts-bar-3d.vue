<!--
  FilePath: \src\components\chart\charts-bar-3d.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 16:26:51
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import { WidgetComponentName } from '@/constants'
import chartsMixins from '@/mixins/chartsMixins'
// 柱状3D图
export default {
  name: WidgetComponentName.ECHARTS_BAR3D,

  mixins: [chartsMixins],

  render(h) {
    return (
      <div
        class="xa-echarts-bar-3d"
        style={this.styles}
        id={this.record.id}
      ></div>
    )
  }
}
</script>
