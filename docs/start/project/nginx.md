<img src="http://www.mjy-blog.cn/blog-assets/nginx.png" style="display: block; width: 350px; margin-left: auto; margin-right: auto;">

## 简介
`Nginx`是由俄罗斯人`Igor Sysoev`编写的十分轻量级的`HTTP`服务器，是一个高性能的`HTTP`和反向代理服务器，同时也是一个`IMAP/POP3/SMTP`代理服务器。

`Nginx`以**事件驱动**的方式编写，所以有非常好的性能，同时也是一个非常高效的反向代理、负载平衡。

`Nginx`做为`HTTP`服务器，有以下几项基本特性：
+ 处理静态文件，索引文件以及自动索引；打开文件描述符缓冲
+ 无缓存的反向代理加速，简单的负载均衡和容错
+ `FastCGI`，简单的负载均衡和容错
+ 模块化的结构。包括`gzipping`, `byte ranges`, `chunked responses`,以及`SSI-filter`等`filter`
+ 支持`SSL`和`TLSSNI`
+ `Nginx`具有很高的稳定性
+ `Nginx`支持热部署

`Nginx`专为性能优化而开发，性能是其最重要的考量,实现上非常注重效率。它支持内核`Poll`模型，能经受高负载的考验,有报告表明能支持高达`50,000`个并发连接数。
## 相关概念
### 正向代理
![正向代理](http://www.mjy-blog.cn/blog-assets/forward-proxy.png)

在客户端（浏览器）配置代理服务器，通过代理服务器进行对目标服务器的访问（翻墙）。
### 反向代理
<img src="http://www.mjy-blog.cn/blog-assets/reverse-proxy.png" style="display: block; width: 446px; margin-left: auto; margin-right: auto;">

反向代理隐藏了真实的服务端，当我们向一个服务发送请求时，用户是无感知的，而这个反向代理服务器会将请求转发到真是的原始服务器，将返回结果返回给用户。
### [负载均衡](https://www.zhihu.com/question/61783920)
![LoadBalance](http://www.mjy-blog.cn/blog-assets/load-balance.png)

**负载均衡**(**LoadBalance**)是一种优化资源利用率技术，用来在多个计算机、网络连接、CPU、磁盘驱动器或其他资源中分配负载，以达到最大化吞吐率、最小化响应时间、同时避免过载的目的。

日常生活中总会有一些拥挤的地方，比如地铁站、医院、火车站等。其实根据我们的经验，无论是挂号，还是排队入场，这些场所一般都会设置多个服务点或者入口的。但是，在这些地方你总会发现，最近的入口会挤满人；而那些距离较远的服务点就宽松很多。而如果有人引导的话，实际情况就会好转，整个服务点都会均摊到部分压力，而不至于让某个服务点太忙，另一个服务点又太闲。

那么，在网络世界中，这些服务点就相当于服务器，而那个所谓的引导者就相当于负载均衡了。
### 动静分离
![Dynamic and static separation](http://www.mjy-blog.cn/blog-assets/Dynamic-and-static-separation.png)
将`Web`应用程序中静态和动态的内容分别放在不同的`Web`服务器上，有针对性的处理动态和静态内容，从而达到性能的提升。
+ 静态文件：如`css`、`html`、`jpg`、`js`等文件
+ 动态文件：如`jsp`、`.do`、`asp`等文件
## 安装
+ Mac/Windows系统：跟普通软件安装一样
+ Linux系统：参考[官方文档](https://nginx.org/en/linux_packages.html#RHEL-CentOS)、[中文文档](https://www.nginx.cn/install)
## 常用命令
这些命令要在`nginx`目录下使用
+ 查看版本号：`nginx -v`
+ 启动nginx：`nginx`
+ 关闭nginx：`nginx -s stop`
+ 重加载配置文件：`nginx -s reload`
## `nginx.conf`配置文件
`nginx`的配置文件由全局块、`events`块、`http`块三部分组成。
+ 全局块：从配置文件开始到`events`块之间的内容，主要设置`nginx`服务器整体运行的一些参数
+ `events`块：主要影响`nginx`服务器与用户的网络连接
+ `http`块：修改最频繁的部分，主要影响负载均衡、反向代理等

### 反向代理
```sh
# 监听了两个虚拟服务
http {
    server {
        listen          80;                           # 默认的监听端口，nginx启动的默认服务端口
        server_name     www.mjy-blog.cn;              # 域名（地址），多个使用空格隔开
        access_log      logs/domain1.access.log main; # 设置缓冲日志
        location / {                                  # 该指令允许根据URI进行不同的配置(匹配/)
            proxy_pass  http://152.136.102.112:7000;  # 代理到目标服务
        }
    }
    server {
        listen          8000;                         # 监听8000端口，用户启动的代理服务
        location ~ /edu/ {                            # 该指令允许根据URI进行不同的配置(匹配路径中含有edu)
            proxy_pass  http://152.136.102.112:9000;  # 代理到目标服务
        }
        location ~ /stu/ {                            # 该指令允许根据URI进行不同的配置(匹配路径中含有stu)
            proxy_pass  http://152.136.102.112:9001;  # 代理到目标服务
        }
    }
}
```
### 负载均衡
```sh
http {
    # 目标服务列表，服务名称自定义为myproject
    upstream myproject {
        # ip_hash;
        server 127.0.0.1:8000 weight=3;# weight 是一种按权重分配请求的方式，此处指127.0.0.1:8000的权重为3，默认值为1
        server 127.0.0.1:8001;
        server 127.0.0.1:8002;
        server 127.0.0.1:8003;
        # fair;
    }

    server {
        listen 80;
        server_name www.domain.com;
        location / {
            proxy_pass http://myproject;      # 反向代理到，负载均衡服务myproject
        }
    }
}
```
Nginx提供了几种分配策略：
+ 轮询（默认）：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器down掉，能自动剔除。
+ `weight`：默认权重为1，权重越高被分配的请求数越高。用于**服务器性能不均匀**的情况。
+ `ip_hash`：每个请求按访问ip的hash结果分配，这样每个访问者固定访问一个服务器，解决session的问题。
+ `fair`：按服务端响应时间分配，时间短的优先分配。
### 动静分离
```sh
http {
    server {
        listen 80;
        server_name www.domain.com;
        # /app1目录下存放前端构建后的静态资源，包含js、css、html、image等
        location /app1/ {                     # 匹配到路径中含有/app1，转发到静态资源服务中
            root        /app1/;               # 指定静态资源目录
            autoindex   on;                   # 允许列出目录资源
            # expires   3d;                   # 设置缓存时间
        }
        # app2应用
        location /app2/ {                     # 匹配到路径中含有/app2，转发到静态资源服务中
            root        /app2/;               # 指定静态资源目录
            autoindex   on;                   # 允许列出目录资源
        }
    }
}
```
### 配置参考文档
+ [`nginx.conf`中文详解](http://www.ha97.com/5194.html)
+ [`nginx`服务的基本配置](https://blog.csdn.net/weixin_42167759/article/details/85049546)
## 高可用集群
下面使用两台`Nginx`做反向代理、负载均衡服务器，当其中一台`Nginx`宕机之后，仍能用另一台来工作，两台`Nginx`之间用`keeplived`来监测心跳。
![高可用](http://www.mjy-blog.cn/blog-assets/high-availability.gif)
### Keepalived介绍
`Keepalived`是一个基于`VRRP`协议来实现的服务高可用方案，可以利用其来避免`IP`单点故障，但是它一般不会单独出现，而是与其它负载均衡技术（如nginx、lvs、haproxy）一起工作来达到集群的高可用。

keepalived可以认为是VRRP协议在Linux上的实现，主要有三个模块，分别是core、check和vrrp。core模块为keepalived的核心，负责主进程的启动、维护以及全局配置文件的加载和解析。check负责健康检查，包括常见的各种检查方式。vrrp模块是来实现VRRP协议的。
#### VRRP协议
`VRRP`全称`Virtual Router Redundancy Protocol`，即虚拟路由冗余协议。可以认为它是实现路由器高可用的容错协议，即将N台提供相同功能的路由器组成一个路由器组(Router Group)，这个组里面有一个master和多个backup，但在外界看来就像一台一样，构成虚拟路由器，拥有一个虚拟IP（vip，也就是路由器所在局域网内其他机器的默认路由），占有这个IP的master实际负责ARP相应和转发IP数据包，组中的其它路由器作为备份的角色处于待命状态。master会发组播消息，当backup在超时时间内收不到vrrp包时就认为master宕掉了，这时就需要根据VRRP的优先级来选举一个backup当master，保证路由器的高可用。

每个Router都有一个1-255之间的优先级别，级别最高的（highest priority）将成为主控（master）路由器。通过降低master的优先权可以让处于backup状态的路由器抢占（pro-empt）主路由器的状态，两个backup优先级相同的IP地址较大者为master，接管虚拟IP。

### keepalived实现nginx高可用
#### 安装keepalived
通过yum方式安装最简单：
```sh
yum install -y keepalived
keepalived -v
Keepalived v1.2.13 (03/19,2015)
```
#### keepalived.conf
```sh
# 以#或!开头的是注释
# Configuration File for keepalived
# 全局定义配置块
global_defs {
    # 设置一个邮箱地址，用于发送消息通知
    notification_email {
        m1635836340@163.com
    }
    # 设置发送邮件时的发送来源（即上述邮箱收到的邮件从哪里发来的）
    notification_email_from www.mjy-blog.cn
    # 用于发送通知电子邮件的远程SMTP服务器.IP地址或域名以及可选的端口号（默认端口号：25）
    # 网易163免费邮箱相关服务器信息
    smtp_server smtp.163.com
    # SMTP服务器连接超时时间(秒)
    smtp_connect_timeout 30
    # 标识机器的字符串(不必是主机名)(默认值：本地主机名)
    router_id LVS_DEVEL
}
# 该脚本将每隔<interval>秒执行一次。将记录所有监视它的VRRP实例的退出代码。
# 请注意，仅当至少一个VRRP实例对其进行监视时，才会执行该脚本。
# 此处的脚本名称：chk_nginx
vrrp_script chk_nginx {
    # 脚本路径
    script "/etc/keepalived/check_nginx.sh"
    # 脚本执行间隔时间（默认1秒）
    interval 2
    # 通过此选项调整权重优先级（默认值：0，范围：-253 ~ 253）
    weight -5 
}
# VRRP实例
vrrp_instance VI_1 { # VI_1实例
    # 实例初始状态：MASTER|BACKUP  主服务器则为MASTER，备份服务器则为BACKUP
    state MASTER
    # 网卡，可通过ifconf查看
    interface eth0
    # 用于区分同一网络上运行的多个VRRP实例，范围1 ~ 255
    virtual_router_id 51
    # 优先级
    priority 100 # 主、备机取值不同，主机较大，备机较小
    # VRRP广告间隔（以秒为单位），发送心跳检测的间隔
    advert_int 2
    # 验证
    authentication {
        # 验证方式PASS|AH
        # PASS - Simple password (suggested)
        # AH - IPSEC (not recommended))
        auth_type PASS
        # 验证密码
        auth_pass 1111
    }
    # 虚拟IP
    virtual_ipaddress {
        172.29.88.222
    }
    track_script {
        chk_nginx
    }
}
```
#### check_nginx.sh
可以根据自己的业务需要自定义判断
```sh
#!/bin/bash
counter=$(ps -C nginx --no-heading|wc -l)       # 运行命令检查nginx
if [ "${counter}" = "0" ]; then                 # 如果niginx未正常运行
    /usr/local/bin/nginx                        # 启动nginx
    sleep 2                                     # 延迟2s
    counter=$(ps -C nginx --no-heading|wc -l)   # 再次检测nginx
    if [ "${counter}" = "0" ]; then             # 如果niginx未正常运行
        /etc/init.d/keepalived stop             # 关闭keepalived
    fi
fi
```
#### 参考文档
+ [官方配置文档-英文](https://www.keepalived.org/manpage.html)
+ [Nginx+Keepalived实现站点高可用](https://segmentfault.com/a/1190000002881132)