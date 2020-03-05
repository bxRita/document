vue-cli3内存溢出，JavaScript heap out of memory    

### 1. vue-cli2遇到此问题的解决办法：
> npm run dev 和 npm run build 直接在前面加上--max_old_space_size=4096

```json
"scripts": {
  	"start": "npm run dev",
    "dev": "node --max_old_space_size=4096 build/dev-server.js",
    "build": "node --max_old_space_size=4096 build/build.js",
    "lint": "eslint --ext .js,.vue src",
    "pre": "node build/pre.js",
    "dll": "rimraf dist && webpack --progress --colors --config build/webpack.dll.conf.js"
  },
```

### 2. vue-cli3遇到此问题的解决办法：
- scripts中添加一句指令
- 安装两个npm包 ： increase-memory-limit 和cross-env
- 安装完成后，先执行一次 npm run fix-memory-limit，然后yarn serve启动即可


 ```json
 "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",    
    "fix-memory-limit": "cross-env LIMIT=4096 increase-memory-limit",
  },
 ```
 同时安装 2 个依赖包
```json
"devDependencies": {
   "increase-memory-limit": "^1.0.3",
   "cross-env": "^5.0.5"
}
```