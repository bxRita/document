import { getCurrentGraph } from '@/utils/graphUtil'

export function gridOpt(globalGridAttr) {
  let options
  if (globalGridAttr.type === 'doubleMesh') {
    options = {
      type: globalGridAttr.type,
      args: [
        {
          color: globalGridAttr.color,
          thickness: globalGridAttr.thickness
        },
        {
          color: globalGridAttr.colorSecond,
          thickness: globalGridAttr.thicknessSecond,
          factor: globalGridAttr.factor
        }
      ]
    }
  } else {
    options = {
      type: globalGridAttr.type,
      args: [
        {
          color: globalGridAttr.color,
          thickness: globalGridAttr.thickness
        }
      ]
    }
  }
  const graph = getCurrentGraph()
  graph.drawGrid(options)
}

export function gridSizeOpt(globalGridAttr) {
  const graph = getCurrentGraph()
  graph.setGridSize(globalGridAttr.size)
}

const tryToJSON = val => {
  try {
    return JSON.parse(val)
  } catch (error) {
    return val
  }
}

export function backGroundOpt(globalGridAttr) {
  const options = {
    color: globalGridAttr.bgColor,
    image: globalGridAttr.showImage ? require('@/assets/logo.svg') : undefined,
    repeat: globalGridAttr.repeat,
    angle: globalGridAttr.angle,
    size: tryToJSON(globalGridAttr.bgSize),
    position: tryToJSON(globalGridAttr.position),
    opacity: globalGridAttr.opacity
  }
  const graph = getCurrentGraph()
  graph.drawBackground(options)
}
