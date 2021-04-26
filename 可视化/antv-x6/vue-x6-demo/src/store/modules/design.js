import {
  ADD_DESIGN_CELL,
  UPDATE_DESIGN_CELL_BY_ID,
  INIT_DESIGN_CELL,
  CLEAN_DESIGN_CELL
} from '../mutation-types'
const design = {
  namespaced: true,
  state: {
    // 设计界面JSON数据
    designCells: []
  },
  getters: {
    // 所有的实体、枚举类型
    fieldTypes: state => () => {
      let cells = state.designCells
      const filterNodes = cells.filter(item => item.shape != 'edge')
      return filterNodes.map(item => {
        return {
          code: item.bxDatas.modelName,
          data: item.bxDatas
        }
      })
    },
    designCells: state => state.designCells,
    getCellById: state => id => {
      return state.designCells.find(item => item.id === id)
    }
  },
  mutations: {
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
    clean({ commit }) {
      commit(CLEAN_DESIGN_CELL)
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
