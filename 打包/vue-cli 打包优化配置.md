### 1. 将 productionSourceMap 设为 false
```js
module.exports = {
    productionSourceMap: false
}
```

### 2. 图片压缩
vue正常打包之后一些图片文件很大，使打包体积很大，通过image-webpack-loader插件可将大的图片进行压缩从而缩小打包体积     
- 先安装依赖：cnpm install image-webpack-loader --save-dev
- 在vue.config.js中module.exports写入：
```js
module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        // ============压缩图片 start============
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end()
        // ============压缩图片 end============
    }
}
```
### 3、cdn配置（可选）
1. 在vue.config.js 最上边写入：
```js
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'

// 本地环境是否需要使用cdn
const devNeedCdn = false

// cdn链接
const cdn = {
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter'
    },
    // cdn的css链接
    css: [],
    // cdn的js链接
    js: [
        'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
        'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
        'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js'
    ]
}
```
(2) 在vue.config.js module.exports chainWebpack中写入：
```js
// ============注入cdn start============
config.plugin('html').tap(args => {
    // 生产环境或本地需要cdn时，才注入cdn
    if (isProduction || devNeedCdn) args[0].cdn = cdn
    return args
})
```
(3) 在vue.config.js module.exports configureWebpack中写入：
```js
// ============注入cdn start============
configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals
}
```
(4) 当前配置的vue.config.js
```js
// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'

// 本地环境是否需要使用cdn
const devNeedCdn = false

// cdn链接
const cdn = {
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter'
    },
    // cdn的css链接
    css: [],
    // cdn的js链接
    js: [
        'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
        'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
        'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js'
    ]
}

module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        // ============压缩图片 start============
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end()
        // ============压缩图片 end============

        // ============注入cdn start============
        config.plugin('html').tap(args => {
            // 生产环境或本地需要cdn时，才注入cdn
            if (isProduction || devNeedCdn) args[0].cdn = cdn
            return args
        })
        // ============注入cdn start============
    },
    configureWebpack: config => {
        // 用cdn方式引入，则构建时要忽略相关资源
        if (isProduction || devNeedCdn) config.externals = cdn.externals
    }
}

```

(5) 在public index.html 写入

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
        <!-- 使用CDN的CSS文件 -->
        <% for (var i in htmlWebpackPlugin.options.cdn &&
        htmlWebpackPlugin.options.cdn.css) { %>
        <link
            href="<%= htmlWebpackPlugin.options.cdn.css[i] %>"
            rel="stylesheet"
        />
        <% } %>
        <!-- 使用CDN的CSS文件 -->
        <title>cli3_base</title>
    </head>
    <body>
        <noscript>
            <strong
                >We're sorry but cli3_base doesn't work properly without
                JavaScript enabled. Please enable it to continue.</strong
            >
        </noscript>
        <div id="app"></div>

        <!-- 使用CDN的JS文件 -->
        <% for (var i in htmlWebpackPlugin.options.cdn &&
        htmlWebpackPlugin.options.cdn.js) { %>
        <script src="<%= htmlWebpackPlugin.options.cdn.js[i] %>"></script>
        <% } %>
        <!-- 使用CDN的JS文件 -->

        <!-- built files will be auto injected -->
    </body>
</html>
```
(6) 重启项目npm run serve

(7) 在src/router.js修改
将
```
Vue.use(Router)
```
改为
```
if (!window.VueRouter) Vue.use(Router)
```
(8) 重新启动`npm run serve`即可，现在的配置是开发环境，在浏览器的Network JS里面是看不到的。若想查看，请将vue.config.js里面的
```
// 本地环境是否需要使用cdn
const devNeedCdn = false
```
改为
```
// 本地环境是否需要使用cdn
const devNeedCdn = true
```
然后再次重启npm run serve，然后浏览器查看Network JS

### 4. 代码压缩
(1) 安装依赖：`cnpm i -D uglifyjs-webpack-plugin`    
(2) 在vue.config.js 最上边引入依赖
```js
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
```
(3) 在vue.config.js module.exports configureWebpack 里面新增
```js
// 生产环境相关配置
if (isProduction) {
    // 代码压缩
    config.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                //生产环境自动删除console
                compress: {
                    warnings: false, // 若打包错误，则注释这行
                    drop_debugger: true,
                    drop_console: true,
                    pure_funcs: ['console.log']
                }
            },
            sourceMap: false,
            parallel: true
        })
    )
}
```

### 5. 开启Gzip
(1) 安装依赖：cnpm install --save-dev compression-webpack-plugin

(2) 在vue.config.js 顶部引入依赖
```js
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')
```
(3) 在vue.config.js module.exports configureWebpack 里面新增，直接放在代码压缩下边即可
```js
// 生产环境相关配置
if (isProduction) {
    // 代码压缩
    // ..................
    // gzip压缩
    const productionGzipExtensions = ['html', 'js', 'css']
    config.plugins.push(
        new CompressionWebpackPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' + productionGzipExtensions.join('|') + ')$'
            ),
            threshold: 10240, // 只有大小大于该值的资源会被处理 10240
            minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
            deleteOriginalAssets: false // 删除原文件
        })
    )
}
```

### 6. 公共代码抽离
(1) 在vue.config.js module.exports configureWebpack 里面新增，直接放在gzip压缩下边即可    
```js
// 公共代码抽离
config.optimization = {
    splitChunks: {
        cacheGroups: {
            vendor: {
                chunks: 'all',
                test: /node_modules/,
                name: 'vendor',
                minChunks: 1,
                maxInitialRequests: 5,
                minSize: 0,
                priority: 100
            },
            common: {
                chunks: 'all',
                test: /[\\/]src[\\/]js[\\/]/,
                name: 'common',
                minChunks: 2,
                maxInitialRequests: 5,
                minSize: 0,
                priority: 60
            },
            styles: {
                name: 'styles',
                test: /\.(sa|sc|c)ss$/,
                chunks: 'all',
                enforce: true
            },
            runtimeChunk: {
                name: 'manifest'
            }
        }
    }
}
```
完整的vue.config.js
```js
// 代码压缩
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

// 是否为生产环境
const isProduction = process.env.NODE_ENV !== 'development'

// 本地环境是否需要使用cdn
const devNeedCdn = true

// cdn链接
const cdn = {
    // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
    externals: {
        vue: 'Vue',
        vuex: 'Vuex',
        'vue-router': 'VueRouter'
    },
    // cdn的css链接
    css: [],
    // cdn的js链接
    js: [
        'https://cdn.staticfile.org/vue/2.6.10/vue.min.js',
        'https://cdn.staticfile.org/vuex/3.0.1/vuex.min.js',
        'https://cdn.staticfile.org/vue-router/3.0.3/vue-router.min.js'
    ]
}

module.exports = {
    productionSourceMap: false,
    chainWebpack: config => {
        // ============压缩图片 start============
        config.module
            .rule('images')
            .use('image-webpack-loader')
            .loader('image-webpack-loader')
            .options({ bypassOnDebug: true })
            .end()
        // ============压缩图片 end============

        // ============注入cdn start============
        config.plugin('html').tap(args => {
            // 生产环境或本地需要cdn时，才注入cdn
            if (isProduction || devNeedCdn) args[0].cdn = cdn
            return args
        })
        // ============注入cdn start============
    },
    configureWebpack: config => {
        // 用cdn方式引入，则构建时要忽略相关资源
        if (isProduction || devNeedCdn) config.externals = cdn.externals

        // 生产环境相关配置
        if (isProduction) {
            // 代码压缩
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        //生产环境自动删除console
                        compress: {
                            warnings: false, // 若打包错误，则注释这行
                            drop_debugger: true,
                            drop_console: true,
                            pure_funcs: ['console.log']
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            )

            // gzip压缩
            const productionGzipExtensions = ['html', 'js', 'css']
            config.plugins.push(
                new CompressionWebpackPlugin({
                    filename: '[path].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold: 10240, // 只有大小大于该值的资源会被处理 10240
                    minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                    deleteOriginalAssets: false // 删除原文件
                })
            )

            // 公共代码抽离
            config.optimization = {
                splitChunks: {
                    cacheGroups: {
                        vendor: {
                            chunks: 'all',
                            test: /node_modules/,
                            name: 'vendor',
                            minChunks: 1,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 100
                        },
                        common: {
                            chunks: 'all',
                            test: /[\\/]src[\\/]js[\\/]/,
                            name: 'common',
                            minChunks: 2,
                            maxInitialRequests: 5,
                            minSize: 0,
                            priority: 60
                        },
                        styles: {
                            name: 'styles',
                            test: /\.(sa|sc|c)ss$/,
                            chunks: 'all',
                            enforce: true
                        },
                        runtimeChunk: {
                            name: 'manifest'
                        }
                    }
                }
            }
        }
    }
}
```















