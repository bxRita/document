
import assign from 'lodash/assign'
import { system } from '@/settings'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import {
  agGenerateOrderByFromSortModel,
  agGenerateWhereFromFiltersModel
} from 'utils/ag-grid'

export default {
  name: 'full-page-ag-grid',
  props: {
    //控制表格占满问题
    sizeColumnsToFit: {
      type: Boolean,
      default: false
    },
    isAllowDefaultSelected: {
      type: Boolean,
      default: false
    },
    colDefs: {
      type: Array,
      default: function() {
        return []
      }
    },
    api: {
      type: Function,
      default: function() {}
    },
    pagination: {
      type: Boolean,
      default: true
    },
    sideBar: {
      type: [Object, Boolean],
      default: function() {
        return {
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true
              }
            },
            {
              id: 'filters',
              labelDefault: 'Filters',
              labelKey: 'filters',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel'
            }
          ]
        }
      }
    },
    pageSize: {
      type: Number,
      default: system.agGridPaginationSize
    },
    rowSelection: {
      type: String,
      default: 'single'
    },
    rowMultiSelectWithClick: {
      type: Boolean,
      default: false
    },
    isSelectAll: {
      type: Boolean,
      default: false
    },
    suppressContextMenu: {
      type: Boolean,
      default: true
    },
    suppressRowClickSelection: {
      type: Boolean,
      default: false
    },
    rowClassRules: {
      type: Function,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      modules: AllModules,
      gridOptions: assign(this.$agGetDefaultGridOptions(), {
        onGridReady: this.gridReady.bind(this),
        onSelectionChanged: this.selectionChanged.bind(this),
        onFilterChanged: this.onFilterChanged.bind(this),
        paginationPageSize: this.pageSize,
        columnDefs: this.colDefs,
        pagination: this.pagination,
        sideBar: this.sideBar,
        rowSelection: this.rowSelection,
        suppressRowClickSelection: this.suppressRowClickSelection, //如果true，单击时不会选择行。例如，当您想要选中复选框时，请使用，并且不想在单击行时选择。
        // enableRangeSelection: true
        // rowMultiSelectWithClick: this.rowMultiSelectWithClick //单击多行将选择多行而无需点击control 或shift键
        getRowStyle: this.rowClassRules, //给行添加样式
        onRowDoubleClicked: this.rowDoubleClicked.bind(this),
        onColumnVisible: this.columnVisiblechange.bind(this)
      }),
      gridApi: null,
      columnApi: null
    }
  },
  methods: {
    /**
     *
     * @param {object} params
     */
    columnVisiblechange(params) {
      this.$emit('columnVisiblechange', params.columns)
    },
    /**
     * Grid就绪事件
     *
     * @param {object} params
     */
    gridReady(params) {
      this.gridApi = params.api
      this.columnApi = params.columnApi
      params.api.setServerSideDatasource(this.serverSideDatasource()) //为远端分页提供数据源
      if (this.sizeColumnsToFit) {
        this.gridApi.sizeColumnsToFit()
      }
      this.$emit('gridReady', this.gridApi)
    },
    /**
     * grid行选择改变
     * @param {object} params
     */
    selectionChanged(params) {
      const selectedRows = params.api.getSelectedRows()
      this.$emit('selectionChanged', selectedRows)
    },
    rowDoubleClicked(params) {
      const selectedRows = params.api.getSelectedRows()
      this.$emit('rowDoubleClicked', selectedRows)
    },
    /**
     * grid 过滤器改变
     *
     */
    onFilterChanged() {
      this.$emit('onFilterChanged', true)
    },
    /**
     * 取消表格所有选中行
     */
    deselectAll() {
      if (this.gridApi) {
        const selectedNodes = this.gridApi.getSelectedNodes()
        if (selectedNodes.length > 0) {
          this.gridApi.deselectAll()
        }
      }
    },
    selectAll() {
      this.gridApi.forEachNode(node => {
        node.setSelected(true)
      })
    },
    /**
     * 反选
     */
    invertSelection() {
      this.gridApi.forEachNode(node => {
        node.setSelected(!node.selected)
      })
    },
    // 没有选中的数据
    noSelect() {
      let datas = []
      this.gridApi.forEachNode(node => {
        if (!node.selected) {
          datas.push(node.data)
        }
      })
      return datas
    },
    /**
     * 页面数据刷新
     */
    refresh() {
      if (this.gridApi) {
        this.deselectAll()
        this.gridApi.purgeServerSideCache()
      }
    },
    /**
     * 获取选择的行集合中第一条数据
     */
    getSelectedNode() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      if (
        selectedNodes &&
        selectedNodes.length > 0 &&
        selectedNodes[0] &&
        selectedNodes[0].id
      ) {
        return selectedNodes[0]
      } else {
        return null
      }
    },
    /**
     * 获取选择的行集合
     */
    getSelectedNodes() {
      const selectedNodes = this.gridApi.getSelectedNodes()
      return selectedNodes
    },
    /**
     * 设置排序模型，用于页面打开时的排序和编辑新增后的排序不一样的情况
     * @param {Object} params 排序参数对象
     */
    setSortModel(params) {
      this.gridApi.setSortModel(params)
    },
    /**
     * 获取服务端数据
     */
    serverSideDatasource() {
      const _this = this
      _this.refresh()
      return {
        getRows: async params => {
          const request = params.request
          const skip = request.startRow
          const first = request.endRow - request.startRow
          const where = agGenerateWhereFromFiltersModel(
            params.request.filterModel
          )
          const orderBy = agGenerateOrderByFromSortModel(request.sortModel)

          const res = await _this.api(
            where,
            orderBy ? orderBy : undefined, // 如果排序值为null，则设置undefined 使用接口默认排序
            first,
            skip
          )
          const selectedNodes = this.gridApi.getSelectedNodes()
          if (res && res.list && res.list.length > 0) {
            params.successCallback(res.list, res.total.aggregate.count)
            //是否全部选中行
            if (this.isSelectAll) {
              for (let i = 0; i < res.list.length; i++) {
                this.gridApi.forEachNode(node => {
                  if (res.list[i].id && node.id == res.list[i].id) {
                    node.setSelected(true)
                  }
                })
              }

              // this.selectAll()
            } else {
              //是否有默认选中行
              if (this.isAllowDefaultSelected) {
                if (selectedNodes.length > 0) {
                  for (let i = 0; i < res.list.length; i++) {
                    if (res.list[i].id != selectedNodes[0].id) {
                      this.gridApi.getRenderedNodes()[0].setSelected(true)
                    }
                  }
                } else {
                  this.gridApi.getRenderedNodes()[0].setSelected(true)
                }
              } else {
                if (selectedNodes.length > 0) {
                  this.deselectAll()
                }
              }
            }
          } else {
            params.successCallback([], 0)
          }
        }
      }
    },
    /**
     * @description 数据字典 code 字典 单元格渲染方法
     * @param {Object} params 单元格 值
     * @returns 返回code
     */
    sysdicCodeCellRenderer(params) {
      return (params.value && params.value.code) || ''
    },
    /**
     * @description 数据字典 name 字典 单元格渲染方法
     * @param {Object} params 单元格 值
     * @returns 返回name
     */
    sysdicNameCellRenderer(params) {
      return (params.value && params.value.name) || ''
    },
    /**
     * 获取ag-grid默认选项
     *
     * @returns
     */
    $agGetDefaultGridOptions() {
      return {
        context: {
          componentParent: this // 传递给子组件
        },
        editType: 'fullRow', // 行编辑模式
        rowSelection: 'single', // single单行选择,multiple多行选择
        rowDeselection: true, // 可取消选择,
        suppressContextMenu: this.suppressContextMenu, // 禁止右键
        suppressMultiSort: true, // 禁止多列排序,必须有
        sortingOrder: ['asc', 'desc'], // 单击列头排序切换顺序
        cacheBlockSize: system.agGridPaginationSize, // 每次从服务端请求30条数据
        rowModelType: 'serverSide', // 服务端模式
        getRowNodeId: rowdata => rowdata.id, // 行Id
        localeTextFunc: this.$agLocaleTextFunc.bind(this), // 本地化方法
        components: {
          sysdicCellRenderer: this.sysdicCodeCellRenderer, // 用于展示数据字典code 字典的过滤筛选
          sysdicNameCellRenderer: this.sysdicNameCellRenderer // 用于展示数据字典name 字典的过滤筛选
        },
        // 列定义
        columnDefs: [
          {
            // 行号列
            type: ['rowNumberColumn']
          }
        ],
        // 列默认属性
        defaultColDef: {
          sortable: true, //启用排序
          resizable: true, //可手动改变列的宽度
          filter: 'agTextColumnFilter', // 默认为文字过滤
          filterParams: {
            newRowsAction: 'keep', // 按照过滤条件刷新数据后，保持过滤条件。
            applyButton: false, // 应用过滤按钮
            clearButton: false // 清除过滤按钮
          },
          enableValue: false,
          enableRowGroup: false,
          enablePivot: false,
          width: 150, //默认每列宽度150像素
          minWidth: 50
        },
        columnTypes: {
          rowNumberColumn: {
            // 行号列
            headerName: this.$t('common.labels.rowIndex'), // 列头文字
            headerClass: 'col-row-index',
            cellClass: 'col-row-index',
            width: 50,
            valueGetter: params => params.node.rowIndex + 1, // 行号计算
            suppressColumnsToolPanel: true, // ”显示列“不出现在toolpanel中
            suppressFiltersToolPanel: true, // ”筛选“不出现在toolpanel中
            suppressMenu: true, // 不要菜单
            sortable: false, // 不要排序
            filter: false, // 不要筛选
            lockPosition: true, // 位置不可改变
            pinned: 'left', // 固定在左侧
            suppressMovable: true // 禁止移动此列
          }
        },
        // sideBar配置
        sideBar: {
          toolPanels: [
            {
              id: 'columns',
              labelDefault: 'Columns',
              labelKey: 'columns',
              iconKey: 'columns',
              toolPanel: 'agColumnsToolPanel',
              toolPanelParams: {
                suppressRowGroups: true,
                suppressValues: true,
                suppressPivots: true,
                suppressPivotMode: true
              }
            },
            {
              id: 'filters',
              labelDefault: 'Filters',
              labelKey: 'filters',
              iconKey: 'filter',
              toolPanel: 'agFiltersToolPanel'
            }
          ]
        }
      }
    },
    /**
     * ag-grid国际化回调函数
     * 注意,若使用$agGetDefaultGridOptions函数,则无需手动调用
     *
     * @param {*} key i18Npath
     * @param {*} defaultValue 默认值
     * @returns i18N结果
     */
    $agLocaleTextFunc(key, defaultValue) {
      const prefix = 'agGrid.'
      const path = prefix + key
      const i18n = this.$t(path)
      let result = defaultValue
      if (this.$te(path) === true && typeof i18n !== 'object') {
        result = i18n
      }
      return result
    }
  }
}
