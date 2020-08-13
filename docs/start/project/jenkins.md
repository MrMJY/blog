## 如何用 jenkins 构建部署项目
![Jenkins](./img/Jenkins.png)

::: tip What is Jenkins?
Jenkins是开源 CI（Continuous Integration：持续集成）&CD（Continuous Delivery：持续交付） 软件领导者， 提供超过1000个插件来支持构建、部署、自动化， 满足任何项目的需要，支持各种运行方式，可通过系统包, Docker 或者通过一个独立的 Java 程序。
:::
### 示意图
![CI&CD](./img/CI&CD.png)

### 为什么选择 Jenkins
+ <b>持续集成和持续交付：</b>作为一个可扩展的自动化服务器，Jenkins可以用作简单的CI服务器，或者变成任何项目的连续交付中心。
+ <b>简易安装：</b>Jenkins是一个独立的基于Java的程序，可以立即运行，包含Windows，Mac OS X和其他类Unix操作系统。
+ <b>配置简单：</b>Jenkins可以通过其网页界面轻松设置和配置，其中包括即时错误检查和内置帮助。
+ <b>插件：</b>通过更新中心中的1000多个插件，Jenkins集成了持续集成和持续交付工具链中几乎所有的工具。
+ <b>扩展：</b>Jenkins 可以通过其插件架构进行扩展，从而为 Jenkins 可以做的事提供几乎无限的可能性。
+ <b>分布式：</b>Jenkins可以轻松地在多台机器上分配工作，帮助更快速地跨多个平台推动构建，测试和部署。

## Jekins 安装
Jenkins是一个开源的软件项目，是基于java开发的一种持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。

### 使用XShell工具操作
使用XShell工具，连接Ubuntu/服务器

网上帖子一堆，这里不是重点
::: tip 踩到的坑
XShell登录的时候输入用户名，无法区分大写，例如登录名为`MJY`，XShell登录验证必须输入`mjy`，否则登录不了
:::
### 搭建Jenkins环境(本地)
#### 需要一台虚拟机
VMware虚拟机、Linux系统(Ubuntu)
网上帖子一堆，这里不是重点

#### 安装JDK
Jenkins是基于java开发的一种持续集成工具，所以需要JDK支持。
```js
// 查看apt库都有哪些jdk版本
apt-cache search java|grep jdk
// 选择版本进行安装
apt-get install openjdk-8-jdk
// 验证安装成功
java -version 
```
其他按照方式网上有很多
#### 安装Jenkins
[选择安装到Ubuntu](https://pkg.jenkins.io/debian-stable/)
```cmd
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
deb https://pkg.jenkins.io/debian-stable binary/
sudo apt-get update
sudo apt-get install jenkins
```
#### 配置Jenkins
默认情况是Jenkins是使用Jenkins用户启动的，但这个用户目前系统并没有赋予权限，这里我们将启动用户修改为root；另外Jenkins默认端口是8080，这个跟tomcat的默认端口冲突，我们也修改一下默认端口。
```cmd
vi /etc/sysconfig/jenkins
# 将 JENKINS_USER="root"
# 将 JENKINS_PORT="8000"
```
#### 启动Jenkins
`sudo service jenkins start`

现在可以访问Linux上启动的Jenkins服务了，在windows浏览器中输入**192.168.0.104:8000**

登录密码在`/var/lib/jenkins/secrets/initialAdminPassword`中，

`cat /var/lib/jenkins/secrets/initialAdminPassword`复制密码登录

### 搭建Jenkins环境(外网)
#### 安装JDK
```cmd
# 查看系统是否安装过java
yum list installed | grep java
# 如果有旧版本的java，可以用如下方法卸载java
yum -y remove java-1.8.0-openjdk*
# 查看yum包含的jdk版本
yum search java
# 或者 yum list java*
# 下载安装java1.8的所有软件包，中途需要输入y来确认下载
yum install java-1.8.0-openjdk*
# 配置全局变量
vi /etc/profile
# 复制以下三行到文件中，按esc退出编辑模式，输入:wq保存退出（这里的JAVA_HOME以自己实际的目录为准）
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.171-8.b10.el6_9.x86_64
export CLASSPATH=.:$JAVA_HOME/jre/lib/rt.jar:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export PATH=$PATH:$JAVA_HOME/bin
# 重新加载全局变量试添加的配置生效
source /etc/profile
# 检查安装是否成功
java -version
```
#### 安装Jenkins
通过war包的方式启动Jenkins，使用window系统下载好Jenkins的war包，然后将war包上传到服务器中
#### 启动Jenkins
我们编写自动启动jenkins的脚本，让服务器开机自动启动jenkins

**（1）编写启动脚本**

在jenkins.war的目录下新建启动脚本jenkins.sh
```sh
#!/bin/bash
# 第一行的#!/bin/bash必须有，否则执行这个脚本会报203错误
# java的目录，根据自己的实际情况修改
JAVA_HOME=/usr/local/src/jdk1.8.0_192
JENKINS_HOME=/home/xxxx/software/jenkins


pid=`ps -ef | grep jenkins.war | grep -v 'grep'| awk '{print $2}'| wc -l`
  if [ "$1" = "start" ];then
  if [ $pid -gt 0 ];then
  echo 'jenkins is running...'
else
  ### java启动服务 后面可以添加一些配置参数httpPort=7000
  nohup $JAVA_HOME/bin/java -jar $JENKINS_HOME/jenkins.war --httpPort=7000  2>&1 &
  fi
  elif [ "$1" = "stop" ];then
  exec ps -ef | grep jenkins | grep -v grep | awk '{print $2}'| xargs kill -9
  echo 'jenkins is stop..'
else
  echo "Please input like this:"./jenkins.sh start" or "./jenkins stop""
  fi
```
**（2）让jenkins有可执行权限**

`chmod +x /usr/local/src/jenkins/jenkins.sh`

**（3）配置开机启动服务**

到`/lib/systemd/system`服务注册目录下创建`jenkins.service`
```cmd
[Unit]
Description=Jenkins
After=network.target

[Service]
Type=forking
ExecStart=/home/xxxx/software/jenkins/jenkins.sh start
ExecReload=
ExecStop=/home/xxxx/software/jenkins/jenkins.sh stop
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```
**（4）创建好服务后,执行一下命令刷新配置**

`systemctl daemon-reload`

**（5）设置开机启动**

`systemctl enable jenkins.service`

**参考文章**

+ [CentOS 7添加开机启动服务/脚本](https://www.linuxidc.com/Linux/2016-12/138079.htm)
+ [Centos 7 Linux创建Jenkins启动脚本以及开机启动服务](http://www.manongjc.com/article/65716.html)
+ [jenkins以war包运行及开机启动配置](https://www.cnblogs.com/h--d/p/11186529.html)

## Jekins 使用
### 修改插件镜像源
+ [Jenkins插件源使用国内镜像中心的最新方法](https://blog.csdn.net/weixin_40046357/article/details/104489497)
+ [更改插件源为国内源](https://www.cnblogs.com/poloyy/p/12785401.html)
### 安装常用(默认)插件
![默认插件](./img/default-plugin.png)
+ 汉化插件 **Localization: Chinese (Simplified)**
+ 参数化构建 **Git Parameter Plug-In**
+ 安装**Node Plugin**(起到Jenkins与Node环境之间的连接作用)
+ Git(管理代码)
+ GitHub

### 在服务器上搭建Node环境
+ 下载Node源码包，可以在window系统上下载Linux的[Node源码包](https://nodejs.org/dist/v12.18.3/node-v12.18.3-linux-x64.tar.xz)，也可以直接在Linux上直接下载。
+ 解压`xz -d node-v12.18.3-linux-x64.tar.xz`、`tar -xvf node-v12.18.3-linux-x64.tar`
+ 设置 nodejs 环境变量
```cmd
vim /etc/profile
#在文件中最下方添加
export NODE_HOME=/usr/maojinyu/software/node-v12.18.3-linux-x64
export PATH=$NODE_HOME/bin:$PATH
```
+ :wq保存并退出，编译/etc/profile 使配置生效
  `source /etc/profile`
+ 验证是否安装配置成功
  `node -v`
+ 安装**Node Plugin**(起到Jenkins与Node环境之间的连接作用)
+ 在Jenkins中配置Node路径
  + 系统管理 -> 全局工具配置 -> NodeJS
  ![配置node路径](./img/configNodejs.png)

不同的系统安装软件的方式可能不同，根据自己的实际情况选择一种安装方式。例如：apt-get、wget

### 创建任务
![创建自定义任务](./img/createjob.png)
### 配置任务
![配置任务](./img/configjob.png)
### 与GitHub结合实现push自动构建
+ 在GitHub上申请[Personal access tokens](https://github.com/settings/tokens)
  + 选择token权限
  ![获取Personal access tokens](./img/token.png)
+ 设置项目的webhook，在项目的settings中
  ![创建webhook](./img/webhook.png)
+ 设置jenkins监听webhook的请求
  + 系统管理 -> 系统配置 -> GitHub 修改 保存
  ![jenkins配置](./img/jenkins-conf.png)
  + 修改任务配置
  ![修改任务配置](./img/build.png)

### 踩到的坑
+ webhook发送的请求始终失败
  + 解决方法：
  ![重置hook](./img/issue1.png)

