##### 1.冒泡排序
```
var bubbleSort = function(arr) {
  for(var i = 0, len = arr.lenth; i < len; i++) {
    for(var j = i + 1; j < len; j++) {
      if(arr[i] > arr[j]) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
```
##### 2.选择排序
```
var selectSort = function(arr) {
  var min;
  for (var i = 0; i < arr.length - 1; i++) {
    min = i;
    for (var j = i + 1; j < arr.length; j++) {
      if (arr[min] > arr[j]) {
        min = j;
      }
    }
    if (i != min) {
      swap(arr, i, min);
    }
    console.log(i + 1, ": " + arr);
  }
  return arr;
};

function swap(arr, index1, index2) {
  var temp = arr[index1];
  arr[index1] = arr[index2];
  arr[index2] = temp;
};
```
##### 3.插入排序
```
var insertSort = function(arr) {
  var len = arr.length,
    key;
  for (var i = 1; i < len; i++) {
    var j = i;
    key = arr[j];
    while (--j > -1) {
      if (arr[j] > key) {
        arr[j + 1] = arr[j];
      } else {
        break;
      }
    }
    arr[j + 1] = key;
  }
  return arr;
};
```
##### 4.希尔排序
```
function shellSort(arr) {
  if (arr.length < 2) {
    return arr;
  };
  var n = arr.length;
  for (gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap /= 2)) {
    for (i = gap; i < n; ++i) {
      for (j = i - gap; j >= 0 && arr[j + gap] < arr[j]; j -= gap) {
        temp = arr[j];
        arr[j] = arr[j + gap];
        arr[j + gap] = temp;
      }
    }
  }
  return arr;
};
```
##### 5.归并排序
```
function merge(left, right) {
  var result = [];
  while (left.length > 0 && right.length > 0) {
    if (left[0] < right[0]) {
      // shift()方法用于把数组的第一个元素从其中删除，并返回第一个元素的值
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }
  return result.concat(left).concat(right);
}

function mergeSort(arr) {
  if (arr.length == 1) {
    return arr;
  }
  var middle = Math.floor(arr.length / 2),
    left = arr.slice(0, middle),
    right = arr.slice(middle);
  return merge(mergeSort(left), mergeSort(right));
}
```
##### 6.快速排序
```
var quickSort = function(arr) {　　
  if (arr.length <= 1) {
    return arr;
  }

  var pivotIndex = Math.floor(arr.length / 2);　
  var pivot = arr.splice(pivotIndex, 1)[0];

  var left = [];
  var right = [];　　
  for (var i = 0; i < arr.length; i++) {　　　
    if (arr[i] < pivot) {　　　　　　
      left.push(arr[i]);　　　　
    } else {　　　　　　
      right.push(arr[i]);　　　　
    }　
  }　　
  return quickSort(left).concat([pivot], quickSort(right));

}; 
```