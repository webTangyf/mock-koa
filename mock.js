const Mock = require('mockjs');
const path = require('path');
const glob = require("glob");
const Koa = require('koa');
const koaBody = require('koa-body');
const logger = require('koa-logger');
const static = require('koa-static');
var cors = require('koa-cors');
const fs = require('fs');
const os = require('os');
const platform = os.platform()
const app = new Koa();
const globPath = glob.sync(path.resolve(__dirname, './router/**/*.js'));
const urlMap = new Map();
const error = require('./error.js');
const config = require('./config.js');
const tool = require('./tool.js');
const chalk = require('chalk');
const symbols = require('log-symbols');
const program = require('commander');
const copy = require('copy-files');

/**
 * 递归创建文件夹
 * @param  {array} fileArr 递归的文件数组
 * @param  {function} callback 最终创建完整的回调函数
 */
function cheakAndCreated(fileArr, callback) {
  if (fileArr && typeof fileArr === 'string') {
    fileArr = [fileArr]
  }
  if (fileArr.length > 0) {
    fs.mkdir(fileArr[fileArr.length - 1], (err) => {
      if (err) {
        if (err.errno === -17) {
          fileArr.pop()
        } else if (err.errno === -2 || err.errno === -4058) {
          fileArr.push(path.resolve(fileArr[0], '../'))
        } else if (err.errno === -13) {
          console.log(err);
          return false;
        } else {
          console.log(err);
        }
      } else {
        fileArr.pop()
      }
      cheakAndCreated(fileArr, callback)
    })
    return false
  }
  callback && callback()
}
/**
 * 
 * 复制文件
 * @param  {string} fileName
 * @param  {string} fileUrl
 */
function copyFile(fileName, fileUrl) {
  var params = {
    files: {},
    dest: fileUrl
  }
  params.files[fileName] = path.resolve(__dirname, `./template/${fileName}`);
  copy(params, function (err) {
    if (err) {
      console.log(symbols.error, chalk.red('copy had some quention please check'));
      console.log(err);
    }
  })
}

/**
 * @desc 获取到当前运行ip地址
 */
function getIPAdress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }
}

program
  .command('serve')
  .action(function () {
    // get data and path
    globPath.forEach(jsonPath => {
      var url = jsonPath.replace(/[\\/][^\\/]*\.js/, '').replace(path.resolve(__dirname, './router'), '');
      /*
       *   用于处理 win 跟 mac 差异
       */
      if (platform !== 'darwin') {
        let baseUrl = path.resolve(__dirname, './router').replace(/\\/g, '/');
        url = url.replace(baseUrl, '');
      }
      var filename = jsonPath.replace(/^.+?[\\/]([^[\\/]+?)(\.[^.\\/]*?)?$/gi, '$1');
      let val;
      if (urlMap.has(url)) {
        val = urlMap.get(url);
      } else {
        val = {};
      }
      val[filename] = require(jsonPath);
      urlMap.set(url, val);
    })

    // created router
    const Router = require('koa-router');
    const main = new Router();
    const routerMap = [...urlMap.keys()];

    // join path and data to koa-router
    routerMap.forEach(path => {
      let interface = urlMap.get(path);
      let request = interface['request'];
      let type = request ? request.type : 'get';
      console.log(path, type)
      main[type](path, (ctx, next) => {
        let params;
        try {
          if (ctx.request.method === "GET") {
            params = ctx.request.query;
          } else {
            params = ctx.request.body;
          }
          // check key is required
          var mockResponse = interface['response']();
          if (request && request['params']) {
            let setParams = request['params'];
            let paramsCheckFlag = false;
            setParams.forEach(key => {
              if (key.startsWith('@')) {
                let originKey = key.replace('@', '');
                if (!params[originKey]) {
                  paramsCheckFlag = true;
                }
              }
            })
            if (paramsCheckFlag) {
              ctx.body = error.paramsError;
              return false
            }
          }

          if (request && request['if'] && request['if'].length > 0) {
            let mateList = [];
            let setIf = tool.getDeepArray(request['if']);
            mateList = setIf.filter(item => {
              let mockIf = item.mockIf;
              let ifKeys = Object.keys(mockIf);
              item.mockIfNum = ifKeys.length;
              if (item.mockIfNum === 0) {
                return false
              }
              return !ifKeys.some(key => params[key] != mockIf[key]);
            })
            if (mateList.length !== 0) {
              if (mateList.length > 1) {
                mateList = mateList.sort((a, b) => -(a['mockIfNum'] - b['mockIfNum']));
              }
              let [mateItem] = mateList;
              if (mateItem.mockType === 'cover') {
                mockResponse = mateItem.mockReturn
              }
              if (mateItem.mockType === 'merge' || !mateItem.mockType) {
                mockResponse = tool.getDeepObject(tool.mergeData(mockResponse, mateItem.mockReturn))
              }
            }
          }
          try {
            ctx.body = Mock.mock(mockResponse);
          } catch (e) {
            ctx.body = error.responseError;
          }
        } catch (e) {
          console.error(e);
          ctx.body = interface['error'] ? interface['error'] : error.commonError;
        }
      });
    })

    // koa middleware
    app.use(logger());
    // app.use(cors());
    app.use(koaBody());
    app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', ctx.headers.origin); // 很奇怪的是，使用 * 会出现一些其他问题
      ctx.set('Access-Control-Allow-Headers', 'content-type');
      ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH');
      ctx.set('Access-Control-Allow-Credentials', true);
      await next();
    });
    // 
    // app.use(static(path.resolve(__dirname, './readme')));

    // begin koa
    app
      .use(main.routes())
      .use(main.allowedMethods());

    app.listen(config.port, () => {
      console.log(symbols.success, chalk.green('mock data has been ready!'));
      console.log(symbols.info, chalk.blue(`baseurl: http://${getIPAdress()}:${config.port}`));
      console.log(chalk.blue('all interface:'));
      routerMap.forEach(url => {
        console.log(symbols.success, chalk.green(url));
      })
    });
  })

// 创建路由
program
  .command('add <name>')
  .action(function (name) {
    if (name.startsWith('/')) {
      console.log(symbols.error, chalk.red('Please enter the relative path'));
      return false;
    }
    let fileUrl = path.resolve(__dirname, './router', './', name);
    cheakAndCreated(fileUrl, () => {
      copyFile('error.js', fileUrl);
      copyFile('request.js', fileUrl);
      copyFile('response.js', fileUrl);
      console.log(symbols.success, chalk.green('mock file had created!'));
    });
  })

program.parse(process.argv);