/*
 * x6 vue 节点的通用配置
 * FilePath: \src\components\nodes\common.js
 * Project: vue-x6-demo
 * CreatedAt: 2021-04-01 15:20:59
 * CreatedBy: ABC (<you@you.you>)
 * Copyright: (c) 2021
 * Task: #1
 * Write a description of the code here.
 */

export default class NodeConfig {
  constructor(colorVal) {
    this.config = {
      shape: 'vue-shape',
      width: 100,
      height: 60,
      attrs: {
        body: {
          width: 100,
          height: 60,
          stroke: colorVal
        }
      },
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 3,
                magnet: true,
                stroke: colorVal,
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          right: {
            position: 'right',
            attrs: {
              circle: {
                r: 3,
                magnet: true,
                stroke: colorVal,
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 3,
                magnet: true,
                stroke: colorVal,
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          },
          left: {
            position: 'left',
            attrs: {
              circle: {
                r: 3,
                magnet: true,
                stroke: colorVal,
                strokeWidth: 1,
                fill: '#fff',
                style: {
                  visibility: 'hidden'
                }
              }
            }
          }
        },
        items: [
          // 连续桩 配置
          {
            group: 'top'
          },
          {
            group: 'right'
          },
          {
            group: 'bottom'
          },
          {
            group: 'left'
          }
        ]
      }
    }
  }
}
