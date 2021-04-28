import {
  ADD_DESIGN_CELL,
  UPDATE_DESIGN_CELL_BY_ID,
  INIT_DESIGN_CELL,
  CLEAN_DESIGN_CELL,
  SET_CURRENT_SELECT_CELL,
  BAK_DESIGN_CELL,
  UPDATE_RELATE_CELL_EDGE
} from '../mutation-types'
import { X6CellType } from '@/config'
const design = {
  namespaced: true,
  state: {
    // 设计界面JSON数据
    designCells: [],
    currentSelectCell: null, // 当前选中的节点
    bakDesignCells: [] // 备份服务端初始返回的模型数据
  },
  getters: {
    // 所有的实体、枚举类型
    fieldTypes: state => () => {
      let cells = state.designCells
      const filterNodes = cells.filter(item => item.shape != X6CellType.edge)
      return filterNodes.map(item => {
        return {
          code: item.bxDatas.modelName,
          id: item.id,
          data: item.bxDatas
        }
      })
    },
    currentSelectCell: state => state.currentSelectCell,
    designCells: state => state.designCells,
    bakDesignCells: state => state.bakDesignCells,
    getBakCellById: state => id => {
      return state.bakDesignCells.find(item => item.id === id)
    },
    getCellById: state => id => {
      return state.designCells.find(item => item.id === id)
    }
  },
  mutations: {
    [UPDATE_RELATE_CELL_EDGE]: (state, payload) => {
      // 更新连线所属节点的 属性信息TODO:
      if (!payload) return
      const { refTableId, relType, resourceField, targetField } = payload
      let cell = state.designCells.find(item => item.id === refTableId)
      let fs = cell?.bxDatas?.fieldsList

      let field = fs && fs.find(item => item.fieldName === resourceField)
      if (field.foreignRela) {
        field.foreignRela = {
          foreignKeyType: relType,
          from: '',
          to: targetField
        }
      }
      if (field?.extends?.bxDatas) {
        field.extends.bxDatas = payload
      }
    },
    [SET_CURRENT_SELECT_CELL]: (state, payload) => {
      state.currentSelectCell = payload
    },
    [BAK_DESIGN_CELL]: (state, payload) => {
      state.bakDesignCells = payload
    },
    [INIT_DESIGN_CELL]: (state, payload) => {
      state.designCells = payload
    },
    [CLEAN_DESIGN_CELL]: state => {
      state.designCells = []
    },
    [ADD_DESIGN_CELL]: (state, payload) => {
      state.designCells.push(payload)
    },
    [UPDATE_DESIGN_CELL_BY_ID]: (state, payload) => {
      const { id } = payload
      const cellIdx = state.designCells.findIndex(item => item.id === id)
      state.designCells.splice(cellIdx, 1, payload)
    }
  },
  actions: {
    updateRelateNodeCell({ commit }, payload) {
      commit(UPDATE_RELATE_CELL_EDGE, payload)
    },
    setSelect({ commit }, payload) {
      commit(SET_CURRENT_SELECT_CELL, payload)
    },
    clean({ commit }) {
      commit(CLEAN_DESIGN_CELL)
    },
    bakDesignCells({ commit }, payload) {
      commit(BAK_DESIGN_CELL, payload)
    },
    initDesignCells({ commit }, payload) {
      commit(INIT_DESIGN_CELL, payload)
    },
    addCell({ commit }, payload) {
      commit(ADD_DESIGN_CELL, payload)
    },
    updateCellById({ commit }, payload) {
      commit(UPDATE_DESIGN_CELL_BY_ID, payload)
    }
  }
}

export default design
