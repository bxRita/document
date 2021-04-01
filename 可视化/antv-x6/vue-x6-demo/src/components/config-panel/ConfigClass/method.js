import { getCurrentGraph } from '@/utils/graphUtil'

export function nodeOpt(id, globalGridAttr) {
  let curCel = null
  if (id) {
    const graph = getCurrentGraph()

    const cell = graph.getCellById(id)
    if (!cell || !cell.isNode()) {
      return
    }
    curCel = cell
    globalGridAttr.nodeStroke = cell.attr('body/stroke')
    globalGridAttr.nodeStrokeWidth = cell.attr('body/strokeWidth')
    globalGridAttr.nodeFill = cell.attr('body/fill')
    globalGridAttr.nodeFontSize = cell.attr('text/fontSize')
    globalGridAttr.nodeColor = cell.attr('text/fill')
    globalGridAttr.nodeUsers = cell.attr('approve/users')
  }
  return curCel
}
