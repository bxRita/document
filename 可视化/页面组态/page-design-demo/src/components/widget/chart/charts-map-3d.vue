<!--
  FilePath: \src\components\chart\charts-map-3d.vue
  Project: page-design-demo
  CreatedAt: 2021-04-15 16:40:52
  CreatedBy: ABC (<you@you.you>)
  Copyright: (c) 2021
  Task: #1
  Write a description of the code here.
-->

<script>
import { WidgetComponentName } from '@/constants'
import chartsMixins from '@/mixins/chartsMixins'
const baseTexture = require('./images/earth.jpg')
const heightTexture = require('./images/bathymetry_bw_composite_4k.jpg')
const environment = require('./images/starfield.jpg')
const texture = require('./images/night.jpg')
const texture1 = require('./images/clouds.png')
// 3d地图
export default {
  name: WidgetComponentName.ECHARTS_MAP3D,

  mixins: [chartsMixins],

  methods: {
    init() {
      this.echartsBase.load(
        {
          backgroundColor: '#000',
          globe: {
            baseTexture,
            heightTexture,

            displacementScale: 0.1,

            shading: 'lambert',

            environment,

            light: {
              ambient: {
                intensity: 0.1
              },
              main: {
                intensity: 1.5
              }
            },

            layers: [
              {
                type: 'blend',
                blendTo: 'emission',
                texture
              },
              {
                type: 'overlay',
                texture: texture1,
                shading: 'lambert',
                distance: 5
              }
            ]
          },
          series: []
        },
        document.querySelector('#' + this.record.id),
        this.options.chartTheme
      )
    }
  },
  render(h) {
    return (
      <div
        class="xa-echarts-mapd"
        style={this.styles}
        id={this.record.id}
      ></div>
    )
  }
}
</script>
