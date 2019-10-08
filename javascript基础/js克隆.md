js浅克隆，就是简单的属性遍历赋值
例：把obj的属性克隆到obj1上
```
var obj = {
  name: "aaa",
  // arr: ['1','2']
}
var obj1 = {}
for (var prop in obj) {
  obj1[prop] = obj[porp];
}
```
> 注意：如果拷贝的是引用值 ，就会有问题；拷贝后两个引用值会操作同一个对象，如上arr如果浅克隆则obj和obj1会指向同一个内存对象


 js 深度克隆
```
// 克隆一个obj
var obj = {
  name: "abc",
  age: 12,
  card: ["visa", "master"],
  wife: {
    name: "zhang",
    sun: {
      name: "aaa"
    }
  } 
}
var obj1 = {};
// 遍历对象 for(var prop in obj)
// 1. 判断是不是原始值 typeof() object
// 2. 判断是数组还是对象 toString  instanceof constructor
// 3. 建立相应的数组或对象
// 递归
function deepClone(origin, target) {
  var target = target || {},
  toStr = Object.prototype.toString,
  arrStr = "[object Array]";
  for(var prop in origin) {
    if(origin.hasOwnProperty(prop)) {
      if(origin[prop] !== "null" && typeof (origin[prop]) == 'object') {
        target[prop] = toStr.call(origin[prop]) == arrStr ? [] : {}
        deepClone(origin[prop], target[prop])
      }else{
        target[prop] = origin[prop]
      }
    }
  }
   return target;
}

deepClone(obj, obj1); // 克隆
console.log(obj1);
```
执行结果如下：
![image.png](https://upload-images.jianshu.io/upload_images/12953648-8eb6200d4409e638.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


