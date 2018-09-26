const Mock = require('mockjs');
const path = require('path');
const glob = require("glob");
const Koa = require('koa');
const koaBody = require('koa-body');
const fs = require('fs');
const app = new Koa();
var cors = require('koa-cors');
const globPath = glob.sync(path.resolve(__dirname, './router/**/*.json'));
const urlMap = new Map();
const error = require('./error.js');
const config = require('./config.js');
const chalk = require('chalk');
const symbols = require('log-symbols');
const logger = require('koa-logger');

// get data and path
globPath.forEach(jsonPath => {
    var url = jsonPath.replace(/[\\/][^\\/]*\.json/, '').replace(path.resolve(__dirname, './router'), '');
    var filename = jsonPath.replace(/^.+?[\\/]([^[\\/]+?)(\.[^.\\/]*?)?$/gi, '$1');
    let val;
    if (urlMap.has(url)) {
        val = urlMap.get(url);
    } else {
        val = {};
    }
    val[filename] = JSON.parse(fs.readFileSync(jsonPath,'utf-8'));
    urlMap.set(url, val);
})

// created router
const Router = require('koa-router');
const main = new Router();
const routerMap = [...urlMap.keys()];

// join path and data to koa-router
routerMap.forEach (path => {
    let interface = urlMap.get(path);
    let request = interface['request'];
    let type = request ? request.type : 'get';
    main[type](path, (ctx, next) => {
        let params;
        try {
            if (ctx.request.method === "GET") {
                params = ctx.request.query;
            } else {
                params = ctx.request.body;
            }
            // check key is required
            if (request && request['params']) {
                let setParams = request['params'];
                let paramsCheckFlag = false;
                setParams.forEach (key => {
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
            try {
                ctx.body = Mock.mock(interface['response']);
            } catch (e) {
                ctx.body = error.responseError;
            }
        } catch (e) {
            ctx.body = interface['error'] ? interface['error'] : error.commonError;
        }
    });
})

// koa middleware
app.use(logger());
app.use(cors());
app.use(koaBody());

// begin koa
app
  .use(main.routes())
  .use(main.allowedMethods());
app.listen(config.port, () => {
    console.log(symbols.success, chalk.green('mock data has been ready!'));
});
