// 操作DOM 元素，将content 显示到网页上
function show(content, dd) {
    window.document.getElementById('app').innerText = "hello " + content;
}
module.exports = show;