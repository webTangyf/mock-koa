# mock-koa使用说明
## 基本介绍

本项目集合了mockjs 以及 koa 完成了一个方便工程师快速进行mock数据的小工具, mockjs提供了假数据的基本<a href="http://mockjs.com/examples.html">api</a>, 而koa实现了服务器的一个快速搭建。为了保证项目的轻便快捷。不希望用户安装除node依赖意外的东西，比如说数据库等。使用静态文件来进行接口的配置化工作，对于开发工作者而言api也是相对简单易懂的。

## 目录结构

	  '|-- mock-koa',                          总文件夹
	  '    |-- .gitignore', 
	  '    |-- README.md',
	  '    |-- config.js',                     mock-koa总配置项
	  '    |-- error.js',                      mock-koa统一错误配置项
	  '    |-- mock.js',                       mock-koa源码
	  '    |-- package.json',
	  '    |-- tool.js',                       js 工具库
	  '    |-- yarn.lock',
	  '    |-- .vuepress',                     文档配置
	  '    |   |-- config.js',
	  '    |-- router',                        接口静态文件
	  '    |   |-- api',
	  '    |       |-- doc',
	  '    |           |-- list',
	  '    |               |-- error.js',      接口: /api/doc/list 配置错误时的统一返回
	  '    |               |-- request.js',	   接口: /api/doc/list 请求配置
	  '    |               |-- response.js',   接口: /api/doc/list 响应配置
	  '    |-- template',
	  '        |-- error.js',                  error.js 生成模版
	  '        |-- request.js',                request.js 生成模版
	  '        |-- response.js',               response.js 生成模版
	  '

::: tip 接口路径
接口路径统一由/router底下文件夹路径构成，如上则生成接口 /api/doc/list
:::


## 开发文档

### 命令行

快速生成接口文件的命令

	node mock add api/xxx/xxx //您想要接口地址

::: warning 警告
这里请不要写成绝对路径
:::


启动服务

	node mock serve

### 总配置

#### config.js

+ port 端口号 
	+ 默认： 4100

#### error.js

+ paramsError 参数错误的返回对象<br>
默认值：
```
{
    retcode: '1111',
    retmsg: '参数不完整'
}
```
+ commonError 全局报错的返回对象<br>
默认值：
```
{
	retcode: '1111',
	retmsg: '系统出错'
}
```
+ responseError 解析错误的返回对象<br>
默认值：
```
{
	retcode: '1111',
	retmsg: 'mock数据格式解析错误'
}
```


### 接口配置

#### request.js

+ type 请求类型<br>默认值：get<br> 参数类型: 字符串

+ params 请求参数列表 <br> 默认值：[] <br> 参数类型: 数组<br> 样例：

```
	params: [
		"@type",
		version
	]
```	

::: tip 小提示
当参数名称前加入@ 代表必传参数
:::

+ if 特殊请求判断列表 <br> 默认值：[] <br> 参数类型: 数组
	+ mockIf 用于判断参数统一性 目前只支持 字符型
	+ mockType 数据合并类型 支持merge，cover两种 <br> 默认值：
		+ merge 合并响应
		+ cover 覆盖响应
	+ mockReturn 响应内容 支持<a href="http://mockjs.com/examples.html">mockapi</a>


完成if案例：
```
if: [
	{
		mockIf: {
			type: '1',
		},
		mockType: 'merge',
		mockReturn : {
			type: '1',
		}
	},
	{
		mockIf: {
			type: '1',
			version: '2'
		},
		mockType: 'cover',
		mockReturn : {
			type: '2',
		}
	},
]

```	
	
::: tip 解释
看到以上案例， 首先当入参type为1时进行匹配，你会看到两个都是符合条件的，那么我们会完全符合mockIf条件并且条件数（注：指参数数量）更多的进行匹配
:::

#### response.js
引入了mock.Random
增强了可操作性，以及自由度
只需要修改 return 下的JSON 就可以获得对应的参数

```
var Random = require('mockjs').Random;

var response = function () {
  return {
    returnCode: "0000",
    returnMsg: "成功",
    email: '@date()'
  };
}

```	

::: tip 小贴士
<a href="http://mockjs.com/examples.html">点击这里可以查看更多MockApi</a>
:::
#### error.js

+ 该接口报错时的返回，针对response文件配置出错

默认值：

```
{
  returnCode: "1111",
  returnMsg: "报错了"
}
```	
