import { rounding } from "@/utils/tools";

import moment from "moment";

/**
 * 根据ag-grid的过滤模型(filterModel)对象生成GraphQL可识别的where条件对象。
 * 此方法将在ag-grid的rowModelType='serverSide'模式下,
 * ServerSideDatasource的getRows方法中自动调用。
 * 参考https://www.ag-grid.com/javascript-grid-server-side-model/
 * 支持`text`、`date` 、`number` 类型过滤条件
 * @param {IServerSideGetRowsParams.IServerSideGetRowsRequest.filterModel} filterModel
 * @param {string} [fieldNamePrefix='node.'] 字段前缀,可选,默认为`node.`,将在构建GraphQL时，针对字段去除此前缀
 * @returns {Object} GraphQL可识别的where条件对象,如: `{"AND":[{"id":1},{"name":"some"}]}`
 */

export function agGenerateWhereFromFiltersModel(
  filterModel,
  fieldNamePrefix = "node."
) {
  const result = {};
  if (!filterModel) {
    return result;
  }

  let keys = Object.keys(filterModel);

  if (keys.length < 1) {
    return result;
  }

  const filters = [];
  for (let key of keys) {
    // 逐个遍历ag-grid设置的筛选条件,每个字段
    const model = filterModel[key];
    const fieldName = key.replace(fieldNamePrefix, ""); // 去掉前缀
    const operator = model.operator;
    if (operator && typeof operator === "string" && operator.length > 0) {
      // 多个条件,AND 或者 OR
      if (fieldName.indexOf(".") === -1) {
        const filter1 = $agGenerateConditionFilter(model.condition1, fieldName);
        const filter2 = $agGenerateConditionFilter(model.condition2, fieldName);
        let filter = {};
        filter[operator] = [filter1, filter2];
        filters.push(filter);
      } else {
        let filter1 = genFiledFilter(model.condition1, fieldName);
        let filter2 = genFiledFilter(model.condition2, fieldName);

        let filter = {};
        filter[operator] = [filter1, filter2];
        filters.push(filter);
      }
    } else {
      //liqi添加 层级且套筛选开始
      let filter = {};
      if (fieldName.indexOf(".") == -1) {
        filter = $agGenerateConditionFilter(model, fieldName);
      } else {
        filter = genFiledFilter(model, fieldName);
        // filter = mergeFilter(filterArr)
      }
      filters.push(filter);
      //liqi添加 层级且套筛选结束
    }
  }

  let arr = mergeFilter(filters);

  result["AND"] = arr;
  return result;
}
/**
 * @description filter格式重新组合过滤条件
 * @param { Array}filterArr 组合筛选条件
 */
function mergeFilter(arr) {
  let brr = [];
  if (arr.length) {
    for (let i = 0; i < arr.length; i++) {
      let item = arr[i];
      if (brr.length) {
        for (let j = 0; j < brr.length; j++) {
          let n = brr[j];
          let k = MergeRecursive(n, item);
          brr.push = k;
        }
      } else {
        brr.push(MergeRecursive({}, item));
      }
    }
  }
  return brr;
}
/**
 * @description 对象递归
 * @param {Object} obj1
 * @param {Object} obj2
 */
function MergeRecursive(obj1, obj2) {
  let arr = Object.keys(obj2);
  let index = -1;
  while (++index < arr.length) {
    let p = arr[index];
    try {
      if (obj2[p].constructor == Object) {
        //对象方式
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        if (p == "AND") {
          //AND并且方式
          obj1[p] = [...obj1[p], ...obj2[p]];
        } else if (p == "OR") {
          //OR 方式
          if (obj1.hasOwnProperty(p)) {
            let m = {};
            m[p] = [].concat(obj1[p]);
            delete obj1[p];
            obj1["AND"] = obj1["AND"] ? [...obj1["AND"], obj2, m] : [obj2, m];
          } else {
            obj1[p] = obj2[p];
          }
        } else {
          obj1[p] = obj2[p];
        }
      }
    } catch (e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}
/**
 * @description 根据field属性 获取过滤属性值
 * @param {Object} model 模型
 * @param {String} fieldName 属性名称
 */
function genFiledFilter(model, fieldName) {
  let dataNodes = fieldName.split(".");
  let child = dataNodes[dataNodes.length - 1];
  let childFilter = $agGenerateConditionFilter(model, child);
  let res = {},
    temp,
    len = dataNodes.length;
  for (var i = len - 2; i >= 0; i--) {
    temp = dataNodes[i];
    if (i == dataNodes.length - 2) {
      res[temp] = childFilter;
    } else {
      let obj = {};
      obj[temp] = Object.assign({}, res);
      res = obj;
    }
  }
  return res;
}

/**
 * 根据ag-grid的排序模型(sortModel)对象生成GraphQL可识别的orderBy对象。
 * 注意，目前仅支持单个字段排序
 * 此方法将在ag-grid的rowModelType='serverSide'模式下,
 * ServerSideDatasource的getRows方法中自动调用。
 * 参考https://www.ag-grid.com/javascript-grid-server-side-model/
 *
 * @param {IServerSideGetRowsParams.IServerSideGetRowsRequest.sortModel} sortModel
 * @param {string} [fieldNamePrefix='node.'] 字段前缀,可选,默认为`node.`,将在构建GraphQL时，针对字段去除此前缀
 * @returns {string} GraphQL查询时的OrderBy字段值,返回值为`null`或者`字符串`
 */
export function agGenerateOrderByFromSortModel(
  sortModel,
  fieldNamePrefix = "node."
) {
  let result = null;
  if (!sortModel || typeof sortModel !== "object" || sortModel.length < 1) {
    return result;
  }
  const order = sortModel[0];
  if (
    !order ||
    !order.colId ||
    !order.sort ||
    typeof order.colId !== "string" ||
    typeof order.sort !== "string"
  ) {
    return result;
  }
  // 去掉前缀
  const fieldName = order.colId.replace(fieldNamePrefix, "");
  // 顺序关键字转大写 asc => ASC,desc => DESC
  const sort = order.sort.toUpperCase();

  if (fieldName && sort) {
    result = `${fieldName}_${sort}`;
  }

  return result;
}
/**
 * 针对每个过滤条件生成对应的GraphQL过滤条件
 * 支持`text`、`date` 、`number` 类型过滤条件,`set` 类型 支持code过滤 FIXME:
 * @param {object} condition 过滤条件
 * @param {string} fieldName 字段名
 * @returns {object} GraphQL过滤条件
 */
function $agGenerateConditionFilter(condition, fieldName) {
  const result = {};
  if (
    !condition ||
    typeof condition !== "object" ||
    !fieldName ||
    typeof fieldName !== "string"
  ) {
    // 检查参数合法
    return result;
  }
  let conditionVale = condition.filter;
  let dateFrom, dateTo; // date类型使用
  let propertyName = "";
  const gteCon = {};
  const lteCon = {};
  const startTime = " 00:00:00"; //某一天开始时间
  const endTime = " 23:59:59.999 "; //某一天结束时间
  let basicDate = "";
  switch (condition.filterType) {
    case "boolean":
      propertyName = `${fieldName}`;
      break;
    case "text":
      // 文字
      switch (condition.type) {
        case "equals":
          propertyName = `${fieldName}`;
          break;
        case "notEqual":
          propertyName = `${fieldName}_not`;
          break;
        case "startsWith":
          propertyName = `${fieldName}_starts_with`;
          break;
        case "endsWith":
          propertyName = `${fieldName}_ends_with`;
          break;
        case "contains":
          propertyName = `${fieldName}_contains`;
          break;
        case "notContains":
          propertyName = `${fieldName}_not_contains`;
          break;
        default:
          propertyName = `${fieldName}`;
          break;
      }
      break;
    case "date":
      // 日期类型
      // 所有的日期类型处理为一个时间范围
      basicDate = condition.dateFrom.split(" ")[0];
      conditionVale = [];
      propertyName = `AND`;
      switch (condition.type) {
        case "equals":
          dateFrom = new Date(basicDate + startTime);
          dateTo = new Date(basicDate + endTime);
          gteCon[`${fieldName}_gte`] = dateFrom.toISOString();
          lteCon[`${fieldName}_lte`] = dateTo.toISOString();
          conditionVale.push(gteCon);
          conditionVale.push(lteCon);
          break;
        case "notEqual":
          dateFrom = new Date(basicDate + startTime);
          dateTo = new Date(basicDate + endTime);
          propertyName = `OR`;
          gteCon[`${fieldName}_gt`] = dateTo.toISOString();
          lteCon[`${fieldName}_lt`] = dateFrom.toISOString();
          conditionVale.push(gteCon);
          conditionVale.push(lteCon);
          break;
        case "lessThan":
          dateTo = new Date(basicDate + startTime);
          propertyName = `${fieldName}_lt`;
          conditionVale = dateTo.toISOString();
          break;
        case "greaterThan":
          dateFrom = new Date(basicDate + endTime);
          propertyName = `${fieldName}_gt`;
          conditionVale = dateFrom.toISOString();
          break;
        case "inRange":
          // 范围区间值,特殊处理
          // 处理结果为: x>=起始值 AND x<=截止值
          propertyName = "AND";
          conditionVale = [];

          if (condition.dateFrom && condition.dateTo) {
            // 两者较小的
            const gteValue =
              condition.dateFrom <= condition.dateTo
                ? condition.dateFrom
                : condition.dateTo;
            // 两者较大的
            const lteValue =
              condition.dateFrom >= condition.dateTo
                ? condition.dateFrom
                : condition.dateTo;
            let startDate = gteValue.split(" ")[0];
            let endDate = lteValue.split(" ")[0];

            dateFrom = new Date(startDate + startTime);
            dateTo = new Date(endDate + endTime);
            gteCon[`${fieldName}_gte`] = dateFrom.toISOString();
            lteCon[`${fieldName}_lte`] = dateTo.toISOString();
            conditionVale.push(gteCon);
            conditionVale.push(lteCon);
          }
          break;
        default:
          propertyName = `${fieldName}`;
          break;
      }
      break;
    case "number":
      // 数字类型
      switch (condition.type) {
        case "equals":
          propertyName = `${fieldName}`;
          break;
        case "notEqual":
          propertyName = `${fieldName}_not`;
          break;
        case "lessThan":
          propertyName = `${fieldName}_lt`;
          break;
        case "greaterThan":
          propertyName = `${fieldName}_gt`;
          break;
        case "lessThanOrEqual":
          propertyName = `${fieldName}_lte`;
          break;
        case "greaterThanOrEqual":
          propertyName = `${fieldName}_gte`;
          break;
        case "inRange":
          // 范围区间值,特殊处理
          // 处理结果为: x>=起始值 AND x<=截止值
          propertyName = "AND";
          conditionVale = [];

          if (
            typeof condition.filter === "number" &&
            typeof condition.filterTo === "number"
          ) {
            // 两者较小的
            const gteValue =
              condition.filter <= condition.filterTo
                ? condition.filter
                : condition.filterTo;
            // 两者较大的
            const lteValue =
              condition.filter >= condition.filterTo
                ? condition.filter
                : condition.filterTo;

            gteCon[`${fieldName}_gte`] = gteValue;
            lteCon[`${fieldName}_lte`] = lteValue;
            conditionVale.push(gteCon);
            conditionVale.push(lteCon);
          }
          break;
        default:
          propertyName = `${fieldName}`;
          break;
      }
      break;
    case "set":
      propertyName = `${fieldName}_in`;
      conditionVale = condition.values;
      break;
    default:
      break;
  }

  if (conditionVale || typeof conditionVale == "number") {
    result[propertyName] =
      condition.filterType === "boolean"
        ? JSON.parse(conditionVale)
        : conditionVale;
  }
  return result;
}

/**
 * @description 获取关联属性值
 * @param {Object} obj 关联对象
 * @param {string} field 关联属性
 * @returns 返回关联属性值
 */
function getMultiFieldVal(obj, field) {
  let curVal = obj;
  let dataNodes = field.split("."),
    len = dataNodes.length;
  let findVal = (item, fieldName) => {
    return item[fieldName];
  };

  for (let i = 0; i < len; i++) {
    let fn = dataNodes[i];
    let temp = findVal(curVal, fn);
    if (temp || temp == "") {
      curVal = temp;
      continue;
    }
    if (i <= len - 1 && !temp) {
      curVal = ``;
      break;
    }
  }
  return curVal;
}

/**
 * @description 处理header中定义的特殊属性
 * @param {Object} header 定义属性的header信息
 * @param {*} temp 属性值
 * @param {*} field 属性名称
 */
function handleSpecialField(header, temp, field) {
  // 枚举类型
  if (header.valueFormatter) {
    temp[field] = header.valueFormatter({
      value: temp[field],
      data: temp,
    });
    return temp;
  }
  // 数值类型
  if (header.filter === "agNumberColumnFilter") {
    temp[field] = rounding(temp[field], 6);
    return temp;
  }

  // 日期类型
  if (header.filter === "agDateColumnFilter") {
    if (header.type && header.type === "datetime") {
      temp[field] = temp[field] && dateFormate(temp[field]);
    } else {
      temp[field] = temp[field] && temp[field].substring(0, 10);
    }

    return temp;
  }

  return temp;
}
/**
 * 日期转换
 */
export function dateFormate(params) {
  if (params) {
    return moment(params).format("YYYY-MM-DD HH:mm:ss");
  }
}
/**
 * @description 处理服务返回的数据
 * @param {Array} arrs 服务返回的数据
 * @param {Array} headers 当前定义的头信息
 */
export function handleServerData(arrs, headers) {
  let len = arrs.length,
    hLen = headers.length,
    index = 1;
  for (let i = 0; i < len; i++) {
    let temp = arrs[i];
    temp.index = index;
    for (let j = 0; j < hLen; j++) {
      let h = headers[j],
        field = h.field,
        isMulField = field && field.indexOf(".") > -1;
      if (!isMulField) {
        temp = handleSpecialField(h, temp, field);
        continue;
      }

      temp[field] = getMultiFieldVal(temp, field);
      temp = handleSpecialField(h, temp, field);
    }
    index++;
  }
  return arrs;
}
