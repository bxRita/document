## Filter Component

### 1. 为什么要使用自定义筛选
目前ag-grid默认已有的过滤器有三种类型：
- 文本类型Text Filter: agTextColumnFilter
- 数值类型Number Filter: agNumberColumnFilter
- 日期类型Date Filter: agDateColumnFilter

实际项目使用时，某些场景使用上面的类型无法实现过滤筛选。过滤器组件允许您将自定义的过滤器类型添加到ag-grid。如果提供的筛选器不符合您的要求，请使用此选项。

### 2. 如何增加自定义过滤器
#### 2.1 自定义过滤器接口说明
要增加自定义过滤器，首先需要了解过滤器提供的接口：
```ts
interface IFilterComp{
    //下面列出的方法为强制实现的方法 

   init(params: IFilterParams): void;  // 过滤器 初始化方法 只调用一次

   getGui(): any; // 返回过滤器自定义的DOM元素或节点 ；****该方法必须要实现****

   isFilterActive(): boolean; // 如果筛选器处于活动状态，则返回true

   doesFilterPass(params: IDoesFilterPassParams): boolean; // 

   getModel(): any; // 获取筛选器状态。如果过滤器未激活，则返回null/undefined

   setModel(model: any): void; // 设置过滤器状态，在gridApi.setFilterModel之后调用

   // 省略可选方法 .....
   
}

```
> 详细说明可查看[官方文档](https://www.ag-grid.com/javascript-grid-filter-component/)

#### 2.2 自定义过滤器样例

案例为自定义下拉过滤组件：

- 1.定义过滤器文件

select-filter.js文件内容如下：
```js
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
    filterItems = colDef.filterParams // ********下拉框数组的值********
  this.gui = document.createElement('div')
  let html = `<select id="filterText" class="ag-filter-select" style="width: 170px" value=""><option value="">---请选择---</option>`
  let filterLen = filterItems.length
  for (let i = 0; i < filterLen; i++) {
    html =
      html +
      `<option value="${filterItems[i].value}">${filterItems[i].text}</opption>`
  }
  this.gui.innerHTML = `${html}</select>`
  this.eFilterText = this.gui.querySelector('#filterText')
  this.eFilterText.addEventListener('change', listener)
  this.filterType = colDef.type || 'text' // ********过滤器值的类型********
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
// 过滤器被激活
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
    type: 'equals'
  }
  return this.filterText ? model : null
}

SelectFilter.prototype.setModel = function(model) {
  this.eFilterText.value = (model && model.filter) || ``
}
```

- 2.使用该自定义过滤器
引入自定义组件的的js文件内容如下：
```js
import { SelectFilter } from '@c/ag-grid/filter' // 引入上述自定义文件

var columnDefs = [
    {
        headerName: "状态", 
        field: "status", 
        width: 150, 
        filter: SelectFilter, // ********使用自定义过滤组件***********
        filterType: 'text', // ********过滤选择值 的类型 ，默认为text，如果为boolean 则增加boolean类型值相关处理***********
        filterParams: [ // 下拉框选项 在自定义过滤组件的setupGui方法中会使用该值
            {
                text: "校验",
                value: "A"
            },
            {
                text: "批准",
                value: "B"
            },
            {
                text: "失效",
                value: "c"
            }
        ]
    }
]
// 省略其它代码
```

- 3.ag-grid针对自定义过滤器处理逻辑      
ag-grid 相关处理逻辑代码参考：`./component/full-page-ag-grid.js`      

![agGrid 过滤处理相关逻辑](https://github.com/bxRita/document/blob/master/ag-grid-vue/imgs/2.png)

- 4.效果如下：
![自定义筛选](https://github.com/bxRita/document/blob/master/ag-grid-vue/imgs/1.png)
