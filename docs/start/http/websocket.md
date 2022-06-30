WebSocket 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议。

WebSocket 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 WebSocket API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。

## 使用
```js
/*
* new WebSocket(url [, protocols])
* url: 指定连接的 URL
* protocols: 可选的，指定了可接受的子协议
*/
var ws = new WebSocket('ws://localhost:8088');
// 监听事件
// 连接成功事件
ws.onopen = function() { console.log('websoket connect') }
// ws.addEventListener('open', function() {}) 注册多个回调

// message：客户端接收服务端数据时触发
ws.onmessage = function(event) {
  // 服务器数据可能是文本，也可能是二进制数据（blob对象或Arraybuffer对象）
  if(typeof event.data === String) {
    console.log("Received data string");
  }

  if(event.data instanceof ArrayBuffer){
    var buffer = event.data;
    console.log("Received arraybuffer");
  }
}
// error：通信发生错误时触发
// close：连接关闭时触发

// ws实例方法
// ws.send()向服务器发送数据
// 发送文本的例子
ws.send('your message');

// 发送 Blob 对象的例子
var file = document.querySelector('input[type="file"]').files[0];
ws.send(file);

// 发送 ArrayBuffer 对象的例子
// Sending canvas ImageData as ArrayBuffer
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data);
ws.send(binary.buffer);

// ws.bufferedAmount
// 表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。
var data = new ArrayBuffer(10000000);
ws.send(data);

if (ws.bufferedAmount === 0) {
  // 发送完毕
} else {
  // 发送还没结束
}

```
::: tip 提示
websoket使用的是`ws`或`wss`协议
:::

## 服务端
**常用的Node实现方式**
+ [µWebSockets](https://github.com/uWebSockets/uWebSockets)
+ [Socket.IO](http://socket.io/)
+ [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node)

**Java实现方式**
+ [Netty-socketio](https://github.com/mrniko/netty-socketio)
