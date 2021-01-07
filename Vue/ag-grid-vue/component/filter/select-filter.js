/*
 * FilePath: \src\components\ag-grid\filter\SelectFilter.js
 * Project: HolliEBR
 * CreatedAt: 2020-02-26 08:46:45
 * CreatedBy: bx (<bx@hollysys.net>)
 * Copyright: (c) 2020
 * Task: #1
 * Write a description of the code here.
 */

import i18n from '@/i18n'
import { SELECT_FILTER_NAME } from './const'

export default function SelectFilter() {}

SelectFilter.prototype.init = function(params) {
  this.valueGetter = params.valueGetter
  this.filterText = null
  this.filterType = null
  this.setupGui(params)
}
// not called by ag-Grid, just for us to help setup
SelectFilter.prototype.setupGui = function(params) {
  let { colDef } = params,
    filterItems = colDef.filterParams
  this.gui = document.createElement('div')
  let html = `<select id="filterText" class="ag-filter-select" style="width: 170px" value=""><option value="">---${i18n.t(
    'common.placeholders.plsSelect'
  )}---</option>`
  let filterLen = filterItems.length
  for (let i = 0; i < filterLen; i++) {
    html =
      html +
      `<option value="${filterItems[i].value}">${filterItems[i].text}</opption>`
  }
  this.gui.innerHTML = `${html}</select>`
  this.eFilterText = this.gui.querySelector('#filterText')
  this.eFilterText.addEventListener('change', listener)
  this.filterType = colDef.type || 'text'
  var that = this
  function listener(event) {
    that.filterText = event.target.value
    params.filterChangedCallback()
  }
}

SelectFilter.prototype.getGui = function() {
  return this.gui
}

SelectFilter.prototype.doesFilterPass = function(params) {
  // make sure each word passes separately, ie search for firstname, lastname
  var passed = true
  var valueGetter = this.valueGetter
  this.filterText
    .toLowerCase()
    .split(' ')
    .forEach(function(filterWord) {
      var value = valueGetter(params)
      if (
        value
          .toString()
          .toLowerCase()
          .indexOf(filterWord) < 0
      ) {
        passed = false
      }
    })

  return passed
}

SelectFilter.prototype.isFilterActive = function() {
  return (
    this.filterText !== null &&
    this.filterText !== undefined &&
    this.filterText !== ''
  )
}

SelectFilter.prototype.getModel = function() {
  var model = {
    filter: this.filterText,
    filterType: this.filterType,
    type: 'equals',
    filterName: SELECT_FILTER_NAME
  }
  return this.filterText ? model : null
}

SelectFilter.prototype.setModel = function(model) {
  this.eFilterText.value = (model && model.filter) || ``
}
