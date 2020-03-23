#### 复现端口号
``` 
http://localhost:8000   qq.com
http://localhost:8888   zhq.com
```

#### 源
源=协议+域名+端口号

#### 浏览器的同源策略
* url 的组成
```
Schema://host:port/path?query#hash
```
* 两个 url 的源相同，就说他们是同源的
```
https://www.baidu.com 和 https://baidu.com 不同源
https://www.zhihu.com 和 https://www.zhihu.com/explore 同源（只是 path 不同）
```
* 通常浏览器允许进行跨域写操作（Cross-origin writes）
> 如链接，重定向；
* 通常浏览器允许跨域资源/脚本嵌入（Cross-origin embedding）
> 如 img、script 标签；
* 通常浏览器不允许跨域读操作（Cross-origin reads）



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

#### script.onload
* script 标签的 onload 事件都是在外部 js 文件被加载完成并执行完成后才被触发的。
* 在 JSONP 中，我们需要在 onload 中消除为了获取数据而添加的 script
```
// zhq.js
const script=document.createElement('script')
script.src=`http://localhost:8888/friends.js?functionName=${random}`
document.body.appendChild(script)
script.onload=()=>{
    script.remove()
}
```
* onerror：脚本文件加载失败时触发

#### JSONP
* JSONP 和 JSON 没有关系
* IE 不支持 CORS,所以我们需要能兼容 IE 的 JSONP
* 实现流程（目的：zhq.com 想访问 qq.com 的 friends.json 数据）
1. zhq.com 利用 script 的 src 调用 qq.com 的 friend.js
2. qq.com 的服务器端有事先设置，当 path 为 friend.js，会将所需数据填充到 qq.js 中
3. 由于 script 的 scr 不受限制，qq.js 的内容顺利在浏览器中执行，于是我们在 zhq.com 的页面获取到了 qq.com 的后台数据
4. 在实际应用中，往往会在 zhq.com 本身的 js（zhq.js） 中写入一个回调函数，然后由 qq.js 触发该函数。

#### referer 检查
对于 JSONP，我们需要在服务端进行 referer 检查，以过滤恶意获取数据的请求
```
// qq.com 的 server.js
if(path === '/friends.js'){
    if(request.headers['referer'].indexOf('http://localhost:8000')===0){
        response.statusCode = 200
        ......
        response.write(string2)
    } else {
        response.statusCode = 404
        response.write('滚!!!')
    }
    response.end()
}
```

#### 【面试】 JSONP 
* JSONP 是什么
> 由于当前浏览器不支持 CORS,我们必须寻找另一种方式来实现跨域。于是我们请求一个 js 文件，该 js 文件会执行一个回调，传回给我们所需的数据。
* 上面说的"回调"的具体函数明是什么?
> 可以随机生成的随机数，作为 callback 的参数传给后台，然后后台将 callback 返回给我们并执行
* JSONP 的优点是什么?
1. 可以跨域
2. 能兼容IE
* JSONP 的缺点是什么?
1. 不能像 CORS 那样精确地返回状态码
2. script 只能发送 GET 请求，（即：JSONP 不支持 POST）


