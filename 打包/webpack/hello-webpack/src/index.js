import React , { Component } from "react";
import "./index.css";
// 导出该组件以供其他模块使用
export default class HelloWebpack extends Component {
    render () {
        return <hl className="hello-component">Hello,Webpack</hl>
    }
}