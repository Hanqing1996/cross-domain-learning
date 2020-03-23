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

比如 zhq.com 访问不到 qq.com 的 friends.json 数据（浏览器对 response 做了拦截，注意请求是可以发送的，只是 response 拿不到）
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
#### JSONP
1. JSONP 和 JSON 没有关系
2. IE 不支持 CORS,所以我们需要能兼容 IE 的 JSONP
