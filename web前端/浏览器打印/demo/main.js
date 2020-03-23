import Print from './printarea'
// 通过commonjs规范引入css模块
window.onload=function(){//当整个HTML文档加载好之后就会触发onload事件
    document.getElementById("test2").onclick=function(){//解除第一个按钮的onclick事件
        printDocument('app')
    }
};

/**
 * @description 根据id 打印文档
 * @param {String} id 要打印的dom的id
 */
function printDocument(id) {
    new Print({
        popTitle:"打印测试的标题",
        ids: `#${id}`, // * 局部打印必传入id
        tab: 0,
        standard: '', // 文档类型，默认是html5，可选 html5，loose，strict
        endCallback: () => {
          // 调用打印之后的回调事件
        }
      })
}