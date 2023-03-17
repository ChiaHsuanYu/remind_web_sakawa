// @ts-check
const { createApp, initFunction } = require('./lib/server');
const { createHttpServer } = require("sakawa-core/utils/express-utils");
const config = require("./lib/config");
const { clog } = require('sakawa-core/hdl-logger');

// 啟動Node.js Server
function startServer(app, config) {
    //取得 httpServer 實體
    const server = createHttpServer(app);

    // 初始化
    initFunction(server).then(() => {
        clog("Node.js Server啟用成功");
    }).catch((error) => {
        //提示 init 錯誤
        console.error(`initFunction error`);
        console.error(error.stack);
        console.error(`Process will exit now`);
        process.exit(1);
    });
}

// 實際啟動Node.js Server
startServer(createApp(config), config);