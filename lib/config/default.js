module.exports = {
    serverName: 'remind_web',
    apiKey: '1234',
    host: 'localhost',
    port: 3002,
    //session
    db: {},
    log: {
        stdout_file: '',
        stderr_file: '',
        sql_dump_file: '',
        consoleDebug: true, //允許global_log顯示並紀錄log
        consoleDebug_level: 150, //允許紀錄的level
        rotate_time_secs: 3600, //滾表時間
        write_sql: true, //寫入預設sql
        db_log: {
            "host": "localhost",
            "port": 3307,
            "user": "root",
            "password": "a5882097",
            "database": "demo_nodejs",
            "connectionLimit": 100,
            "show_clog": false
        },
        nlog_server: {
            server: ''
        }, //使用外部nlog server
    },
    file: {
        file_name: "test.txt",
        path: "./public/file"
    },
    status: {
        log_stst_to_clog: false, //輸出CPU資訊到console
    },
    output_interval: 1000
}