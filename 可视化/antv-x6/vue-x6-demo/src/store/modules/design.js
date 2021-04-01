import { ADD_DESIGN_CELL, UPDATE_DESIGN_CELL_BY_ID } from '../mutation-types'
const design = {
  namespaced: true,
  state: {
    // 设计界面JSON数据
    designCells: []
  },
  getters: {
    designCells: state => state.designCells,
    getCellById: state => id => {
      return state.designCells.find(item => item.id === id)
    }
  },
  mutations: {
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
    addCell({ commit }, payload) {
      commit(ADD_DESIGN_CELL, payload)
    },
    updateCellById({ commit }, payload) {
      commit(UPDATE_DESIGN_CELL_BY_ID, payload)
    }
  }
}

export default design
