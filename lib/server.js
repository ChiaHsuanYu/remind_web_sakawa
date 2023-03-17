// @ts-check
const express = require('express');
const config = require('./config');
const logger = require('sakawa-core/hdl-logger');
// @ts-ignore
const { orig_console_log, clog, overwriteConsoleLog } = logger;
const dbLogger = require('sakawa-core/database/db-logger');
const osInfo = require('sakawa-core/os-info');
const session = require('express-session'); //使用express-session
const cookieParser = require('cookie-parser'); //使用cookie-parser

// const { spawn } = require('child_process');
const { execFile } = require('child_process');

// 初始化 dbLogger, 依專案需求設定
dbLogger.serverName = config.server_name;
dbLogger.initSkwMysql(config.log.db_log);
// 初始化 SakawaMysql 操作記錄使用的 dbLogger, 依專案需求設定
logger.db_callback = dbLogger.write_server_ap_log.bind(dbLogger);

//覆寫 console.log
overwriteConsoleLog(3, true);

logger.start(config.log);

// 初始化db連線
const remind_db = require('./db_connect');
const { options } = require('./router');

// 建立一個Express App實體
function createApp(config) {
    const app = express();

    //response header不顯示x-powered-by(安全問題)
    if (!config.debug) {
        app.disable('x-powered-by');
    }

    //設定 middleware
    app.use(express.json());
    app.use(cookieParser('123456789'));
    app.use(session({
        secret: '123456789',
        resave: true,
        saveUninitialized: true
    }));
    app.use('/public', express.static('public')); // http://localhost:3001/public/logo.jpg
    //設定 router module 提供 rounting 與 controller(handler)
    app.use(require('./api_router'));
    return app;
}

async function initFunction(server) {
    //啟用 http 服務監聽指定 port 號。
    function listenCallback() {
        clog(`server listening on ${config.port}`);
    }
    // 程序持續監聽remind_schedule
    // execFile('node', ['remind_schedule.js'], (error, stdout, stderr) => {
    //     if (error) {
    //         console.error(`error: ${error}`);
    //         return;
    //     }
    //     console.log(`stdout: ${stdout}`);
    //     console.error(`stderr: ${stderr}`);
    // });

    server.listen(config.port, listenCallback);
}
// 將Express的實體 跟 執行拆成兩個function，有利於之後使用撰寫程式測試(Mocha,Jest,...)
module.exports = {
    createApp,
    initFunction,
};