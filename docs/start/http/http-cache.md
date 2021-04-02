## 缓存及其优点

**缓存**：是一种可以自动保存常见资源副本并可以在下一次请求中直接使用副本而非再次获取的技术。

也就是说，当我们首次进行资源请求之后，服务器在返回资源给客户端的同时，缓存服务器或本地缓存也会保存一份资源副本（在允许缓存的情况下），当我们下次再对该资源进行请求时，则会**直接使用资源副本而不会从原始服务器再次请求文档**。

**缓存的优点**：
+ 缓存可以减少冗余的数据传输。
+ 缓存可以缓解网络瓶颈的问题。
+ 缓存可以降低对原始服务器的要求。
+ 缓存可以降低请求的距离时延。

+ 客户端发送请求，服务器收到请求时，会在 200 OK 中回送该资源的`Last-Modified`和`ETag`头
+ 客户端将该资源保存在`cache`中，并记录这两个属性。
+ 当客户端需要发送相同的请求时，会在请求中携带`If-Modified-Since`和`If-None-Match`两个头。两个头的值分别是响应中`Last-Modified`和`ETag`头的值。
+ 服务器通过这两个头判断本地资源未发生变化，客户端不需要重新下载，返回304响应。
+ 客户端使用`cache`内缓存的资源。

## 相关概念及图解
**缓存命中**

如果某个请求的结果是由已缓存的副本提供的，被称作缓存命中。

**缓存未命中**

如果缓存中没有可用的副本或者副本已经过期，则会将请求转发至原始服务器，这被称作缓存未命中 。

![缓存命中/缓存未命中](http://www.mjy-blog.cn/blog-assets/cache1.png)

**新鲜度检测**

HTTP通过缓存将服务器文档的副本保留一段时间。在这段时间里， 都认为文档是“新鲜的”，缓存可以在不联系服务器的情况下，直接提供该文档。但一旦已缓存副本停留的时间太长，超过了文档的新鲜度限值(freshness limit), 就认为对象“过时”了，在提供该文档之前，缓存要再次与服务器进行确认，以查看文档是否发生了变化。

**再验证**

原始服务器上的内容可能会随时变化，缓存需要经常对其进行检测，看看它保存的副本是否仍是服务器上最新的副本。这些新鲜度检测被称为 HTTP 再验证。

缓存可以随时对副本进行再验证，但大部分缓存只在客户端发起请求，并且副本旧得足以需要检测的时候，才会对副本进行再验证。

**再验证命中和再验证未命中**

缓存对缓存的副本进行再验证时，会向原始服务器发送一个再验证请求，如果内容没有发生变化，服务器会以304 Not Modified进行响应。这被称作是再验证命中或者缓慢命中。如果内容发生了变化，服务器会以200进行响应。这被称作再验证未命中。

![](http://www.mjy-blog.cn/blog-assets/cache2.png)

## 缓存的处理步骤

+ 首先是当用户请求资源时，会判断是否有缓存，如果没有，则会向原服务器请求资源。
+ 如果有缓存，则会进入强缓存的范畴，判断缓存是否新鲜，如果缓存新鲜，则会直接返回缓存副本给客户端。如果缓存不新鲜了，则表示强缓存失败，将会进入到协商缓存。
+ 协商缓存将判断是否存在Etag和Last-Modified首部，通过这些首部验证资源是否发生过变化，如果未发生变化，则表示命中了协商缓存，会重定向到缓存副本，将资源返回给客户端，否则的话表示协商缓存未命中，服务器会返回新的资源。

![](http://www.mjy-blog.cn/blog-assets/cache3.png)

**强缓存**

![](http://www.mjy-blog.cn/blog-assets/cache4.png)

首次发起请求时，服务端会在Response Headers 中写入缓存新鲜时间。当请求再次发出时，如果缓存新鲜，将直接从缓存获取资源，而不会再与服务器发生通信。

**协商缓存**

![](http://www.mjy-blog.cn/blog-assets/cache5.png)

协商缓存机制下，浏览器需要向服务器去询问缓存的相关信息，进而判断是重新发起请求、下载完整的响应，还是从本地获取缓存的资源。

## 强缓存和协商缓存的实现原理

### 强缓存实现原理
强缓存是通过`Expires`首部或`Cache-Control: max-age`来实现的。

Expires 和 Cache-Control: max-age都是用来标识资源的过期时间的首部。

**Expires（HTTP/1.0）**
```js
// Expires描述的是一个绝对时间，由服务器返回，用GMT格式的字符串表示。
Expires: Wed, 18 Sep 2019 03:46:40 GMT
```

::: tip 提示
由于expires是一个绝对时间，如果人为的更改时间，会对缓存的有效期造成影响，使缓存有效期的设置失去意义。因此在http1.1中我们有了expires的完全替代首部`cache-control：max-age`
:::

**Cache-Control（HTTP/1.1）**
```js
// max-age值是一个相对时间，它定义了文档的最大使用期
// 从第一次生成文档到文档不再新鲜、无法使用为止，最大的合法生存时间(以秒为单位)。
Cache-Control: max-age=31536000
```

**过程说明**
+ 当我们首次请求资源时，服务器在返回资源的同时，会在Response Headers中写入`expires`首部或`cache-control`，标识缓存的过期时间，缓存副本会将该部分信息保存起来。
+ 当再次请求该资源的时候，缓存会对`date`(date 是一个通用首部，表示原始服务器消息发出的时间。即表示的是首次请求某个资源的时间。)和`expires/cache-control`的时间进行对比，从而判断缓存副本是否足够新鲜。

![](http://www.mjy-blog.cn/blog-assets/cache6.png)

### 协商缓存实现原理
协商缓存是通过请求头`Last-Modified`或`Etag`来实现的。

Last-Modified 标识的是文档最后修改时间，Etag 则是以文档内容来进行编码的。

**Last-Modified**
![](https://user-gold-cdn.xitu.io/2018/11/4/166de151763c87aa?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

**过程说明**
+ 首次请求资源时，服务器在返回资源的同时，会在`Response Headers`中写入`Last-Modified`首部，表示该资源在服务器上的最后修改时间。
+ 当再次请求该资源时，会在`Request Headers` 中写入`If-Modified-Since`首部，此时的`If-Modified-Since`的值是首次请求资源时所返回的`Last-Modified`的值。
+ 服务器接收到请求后，会根据`If-Modified-Since`的值判断资源在该日期之后是否发生过变化。
+ 如果没有，则会返回304 Not Modified; 如果变化了，则会返回变化过后的资源，**同时更新**`Last-Modified`的值。
![](http://www.mjy-blog.cn/blog-assets/cache7.png)

![](http://www.mjy-blog.cn/blog-assets/cache8.png)

**Etag**
![](https://user-gold-cdn.xitu.io/2018/11/4/166de24605025515?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

Etag的实现过程和Last-Modified完全一样，具体过程可参照Last-Modified，在这里就不做过多介绍了。

### Last-Modified存在的一些问题

有些文档可能会被周期性地重写，但实际包含的数据常常是一样的。尽管内容没有变化，但修改日期会发生变化。

有些文档可能被修改了，但所做修改并不重要，不需要让缓存重载数据(比如对拼写或注释的修改)。

有些服务器提供的文档会在亚秒间隙发生变化(比如，实时监视器)，对这些服务器来说，以一秒为粒度的修改日期可能就不够用了。

通过这些描述，我们可以总结出一些Last-Modified存在的缺陷：

+ 无法感知文件内容是否真的发生了变化。 不该重新请求的时候，也会重新请求。
+ 在秒以下的内容变化无法感知到。 该重新请求的时候，反而没有重新请求。

对于上述问题，**`Etag`作为`Last-Modified`的补充而出现**，Etag 是由服务器为每个资源生成的唯一的标识字符串，这个标识字符串是基于文件内容编码的，只要文件内容不同，它们对应的 Etag 就是不同的，因此 Etag 能够精准地感知文件的变化。

### Etag 强验证器和弱验证器

强验证器要求文档的每个字节都相等，而弱验证器只要求文档的含义相等。

**强验证：**`etag: "AkjdfOms1QWEsdfWE"`

**弱验证（前面会加上‘ W/’ 来标识）：**`ETag: W/"c4f5-166b94fe170"`

### Cache-Control请求头常用属性说明

**max-age/s-maxage**

`s-maxage`指令的功能和`max-age`是相同的，它们唯一的不同点就在于`s-maxage`指令只适用于代理服务器缓存。`s-maxage`的优先级高于`max-age`。

**public/private**

`public` 与 `private` 是针对资源是否能够被代理服务缓存而存在的一组对立概念。

如果我们为资源设置了 `public`，那么它既可以被浏览器缓存，也可以被代理服务器缓存；如果我们设置了 `private`，则该资源只能被浏览器缓存。

**no-cache/no-store**

`no-cache`表示客户端要求缓存在提供其已缓存的副本之前必须先和原始服务器对该文档进行验证。即强制跳过强缓存阶段，直接进行协商缓存。强缓存并不能知道缓存是否真的足够新鲜，使用`no-cache`就是为了防止从缓存中返回过期的资源，对缓存进行再验证。

`no-store`表示的是禁止缓存，即每一次都是直接与原服务器进行通信，从原服务器返回资源。一般设置了`no-store`的资源，都暗示着该资源具有敏感性信息。

### 优先级问题

**Expires 和 Cache-Control: max-age**

应用HTTP/1.1版本的缓存服务器遇到同时存在Expires首部字段的情况时，会优先处理max-age指令，而忽略掉Expires首部字段。 而HTTP/1.0版本的缓存服务器的情况则相反，max-age指令会被忽略掉。

**Last-Modified 和 Etag**

查询资料中

## 前后端具体如何实现HTTP缓存？

### 前端如何实现HTTP缓存

前端设置html页面缓存方法：静态的html页面想要设置使用缓存需要通过HTTP的META设置`expires`和`cache-control`设置如下网页元信息:

```html
<html>
  <meta http-equiv="Cache-Control" content="max-age=7200" />
  <meta http-equiv="Expires" content="Mon, 20 Jul 2013 23:00:00 GMT" />
</html>
```
cache-control：no-cache || no-store || max-age

+ no-cache: 表面意为“数据内容不被缓存”，而实际数据是被缓存到本地的，只是每次请求时候直接绕过缓存这一环节直接向服务器请求最新资源
+ no-store: 指示缓存不存储此次请求的响应部分
+ max-age: 表示此次请求成功后 x 秒之内发送同样请求不会去服务器重新请求，而是使用本地缓存

### 后端如何实现HTTP缓存：
**以NODE为例**

```js
import http from 'http';
// 通过设置 Cache-Control 实现缓存
let server = http.createServer((req, res) => {
  // 中间代理服务器可以缓存，缓存时间是86400秒（60 * 60 * 24 = 86400，1天）
  // Cache-Control 是 HTTP/1.1 提出的
  // Expires 是 HTTP/1.0 提出的
  res.setHeader('Cache-Control', 'public, max-age=86400');
});

server.listen('8088');
```
```js
import http from 'http';
// 通过设置 ETag 实现缓存(ETag是资源内容计算出来的哈希值)
let server = http.createServer((req, res) => {
  console.log(req.url, req.headers['if-none-match']);
  if (req.headers['if-none-match']) {
    // 检查文件版本
    res.statusCode = 304
    res.end()
  } else {
    res.setHeader('Etag', 'a1efs5ed3qe1')
    res.end('xxx.html')
  }
});

server.listen('8088');
```
```js
import http from 'http';
// 通过设置 Last-Modified 实现缓存
let server = http.createServer((req, res) => {
  console.log(req.url, req.headers['if-modified-since']);
  if (req.headers['if-modified-since']) {
    // 检查文件更新时间戳
    // 如果 if-modified-since 时间跟资源的最后修改时间相同，表示资源未过期
    res.statusCode = 304
    res.end()
  } else {
    // 更新时间
    res.setHeader('Last-Modified', Date.now())
    res.end('xxx.html')
  }
});

server.listen('8088');
```

**Vue项目部署Nginx常用配置**

```.config
upstream backend {
    server 127.0.0.1:7052;
}
server {
  listen       80;
  server_name  domain.com www.domain.com;
  client_max_body_size 10m;
  root   /usr/share/nginx/project_dir;

  location / {
      try_files $uri /index.html; # vue history模式必须的配置
      index index.html;
  }

  # 禁止缓存index.html页面
  location /index.html {
      add_header Cache-Control "no-cache, no-store, must-revalidate";
  }

  # 缓存静态文件
  location ^~ /static/ {
      add_header Cache-Control "public,max-age=31536000";
  }

  # 与后端api的请求
  location ~ ^/api/ {
      proxy_set_header Host $host;
      proxy_set_header Remote_Addr $remote_addr;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_pass http://backend;
  }

  location /web-socket/ {
      proxy_pass http://backend;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";
  }
}
```

参考：

+ [使用 HTTP 缓存：Etag, Last-Modified 与 Cache-Control](https://juejin.im/entry/5a13be3bf265da432d27b7ec)
+ [网站优化：浏览器缓存控制简介及配置策略](https://www.renfei.org/blog/http-caching.html)
+ [Nginx 配置详解](https://www.runoob.com/w3cnote/nginx-setup-intro.html)

### 小结
![](https://user-gold-cdn.xitu.io/2018/11/4/166de9300ec9105c?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)
