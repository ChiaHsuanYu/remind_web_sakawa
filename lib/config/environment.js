// @ts-check
const path = require('path');
const { toIntegerConfig, toBooleanConfig } = require('sakawa-core/utils/env-parser');
// 環境參數前綴 EXM 是用來區隔主機上不同專案的系統參數值必須為唯一值，所以要確認未來主機上不會與其他專案使用的系統參數名稱重複。
module.exports = {
    serverName: process.env.HOST || 'localhost',
    port: process.env.PORT || 3002,
    db: {
        host: process.env.TEST_DB_HOST || "192.168.86.50",
        user: process.env.TEST_DB_USER || "root",
        password: process.env.TEST_DB_PASSWORD || "a5882097",
        database: process.env.TEST_DB_DATABASE || "demo_nodejs",
        port: toIntegerConfig(process.env.TEST_DB_PORT || 3307),
    },
    log: {
        stdout_file: process.env.TEST_LOG_STDOUT_FILE,
        stderr_file: process.env.TEST_LOG_STDERR_FILE,
        sql_dump_file: process.env.TEST_LOG_SQL_DUMP_FILE,
        consoleDebug: process.env.TEST_LOG_CONSOLE_DEBUG, //允許global_log顯示並紀錄log
        consoleDebug_level: process.env.TEST_LOG_CONSOLE_DEBUG_LEVEL, //允許紀錄的level
        rotate_time_secs: process.env.TEST_LOG_ROTATE_TIME_SECS, //滾表時間
        write_sql: process.env.TEST_LOG_WRITE_SQL, //寫入預設sql
        db_log: {
            host: process.env.TEST_LOG_DB_HOST,
            user: process.env.TEST_LOG_DB_USER,
            password: process.env.TEST_LOG_DB_PASSWORD,
            database: process.env.TEST_LOG_DB_DATABASE,
            port: toIntegerConfig(process.env.TEST_LOG_DB_PORT),
            connectionLimit: toIntegerConfig(process.env.TEST_LOG_DB_CONNECTION_LIMIT),
            show_clog: toBooleanConfig(process.env.TEST_LOG_DB_SHOW_CLOG)
        },
        nlog_server: {
            server: process.env.TEST_LOG_NLOG_SERVER,
            port: process.env.TEST_LOG_NLOG_PORT,
            apiKey: process.env.TEST_LOG_NLOG_API_KEY,
            sendTimer: process.env.TEST_LOG_NLOG_SEND_TIMER,
            serverInfo: {
                server_name: process.env.TEST_LOG_NLOG_SERVER_INFO_SERVER_NAME,
                ip: process.env.TEST_LOG_NLOG_SERVER_INFO_IP,
                source: process.env.TEST_LOG_NLOG_SERVER_INFO_SOURCE,
                cn: process.env.TEST_LOG_NLOG_SERVER_INFO_CN,
            }
        }, //使用外部nlog server
    },
    status: {
        log_stst_to_clog: false, //輸出CPU資訊到console
        output_interval: 1000
    }
}