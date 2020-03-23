#### 源
源=协议+域名+端口号

#### 同源
* url 的组成
```
Schema://host:port/path?query#hash
```
两个 url 的源相同，就说他们是同源的
```
https://www.baidu.com 和 https://baidu.com 不同源
https://www.zhihu.com 和 https://www.zhihu.com/explore 同源（只是 path 不同）
```
#### referer
不同页面发送的请求在后端服务器看来几乎没有区别，除了 referer 不同。
* https://www.baidu.com/
* https://www.zhihu.com/

#### 同源策略
> 不同源的页面之间，浏览器不许互相访问数据

> 比如 zhq.com 访问不到 qq.com 的 friends.json 数据（浏览器对 response 做了拦截，注意请求是可以发送的，只是 response 拿不到）
```
// qq-com 目录下
node server.js 8888

// zhq-com 目录下
node server.js 8000
```
```
// 浏览器
http://localhost:8000/index.html
```
---
## 解决跨域的方案
#### CORS(Cross-Origin Resource Sharing) 
> 在 response 中进行标识，浏览器看到标识就知道允许跨域了
```
// qq.com 的 server.js
if(path === '/friends.json'){
    response.statusCode = 200
    response.setHeader('Content-Type', 'text/css;charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin','http://localhost:8000') // 允许 http://localhost:8000 跨域访问
    response.write(fs.readFileSync('./public/friends.json'))
    response.end()
}
```

#### <script src='http://localhost:8888/friends.js'></script> 是什么意思
1. 相当于在浏览器的 url 栏中输入 http://localhost:8888/friends.js，获取到的 js 内容将在浏览器中执行。
2. 注意区别
``` 
// 跨域，浏览器不允许（<script src='./zhq.js'></script> 同理）
<script>
    request.open('GET','http://localhost:8000/friends.json')
</script>
```
``` 
// 不属于跨域，因为浏览器解析HTML代码时，原生具有src属性的标签，浏览器都赋予其HTTP请求的能力，而且不受跨域限制
<script src='http://localhost:8888/friends.js'></script>
```
#### JSONP
* JSONP 和 JSON 没有关系
* IE 不支持 CORS,所以我们需要能兼容 IE 的 JSONP
* 实现流程（目的：zhq.com 想访问 qq.com 的 friends.json 数据）
1. zhq.com 利用 script 的 src 调用 qq.com 的 friend.js
2. qq.com 的服务器端有事先设置，当 path 为 friend.js，会将所需数据填充到 qq.js 中
3. 由于 script 的 scr 不受限制，qq.js 的内容顺利在浏览器中执行，于是我们在 zhq.com 的页面获取到了 qq.com 的后台数据
4. 在实际应用中，往往会在 zhq.com 本身的 js（zhq.js） 中写入一个回调函数，然后由 qq.js 触发该函数。

