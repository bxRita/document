class EndWebpackPlugin {

    constructor(doneCallback, failCallback) {
        this.doneCallback = doneCallback;
        this.failCallback = failCallback;
    }

    apply(compiler) {
        compiler.hooks.done.tap('EndWebpackPlugin', (stats) => {
            this.doneCallback(stats);
        });
        compiler.hooks.failed.tap('EndWebpackPlugin', (err) => {
            this.failCallback(err);
        });
    }
}

module.exports = EndWebpackPlugin;

/**
 *  要实现该插件，需要借助以下两个事件。
 *  done ： 在成功构建并且输出文件后， Webpack 即将退出时发生。
 *  failed ： 在构建出现异常时导致构建失败， Webpack 即将退出时发生。
 */