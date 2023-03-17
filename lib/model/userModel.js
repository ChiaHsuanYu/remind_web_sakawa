// @ts-check
//取得SakawaMysql實體
const db = require('sakawa-core/database/database-factory').getDatabase('demo_nodejs');
const { clog } = require('sakawa-core/hdl-logger');
const md5 = require("md5");

const userModel = {
    // 判斷登入帳號是否重複
    check_user_by_account: async(data) => {
        const [results, fields] = await db.n_query('SELECT `id` FROM `users` WHERE `account` = ' + db.escape(data.account));
        return results;
    },
    // 檢查使用者是否存在
    check_user: async(data) => {
        let password = md5(data.password);
        const [results, fields] = await db.n_query('SELECT * FROM `users` WHERE `account` = ' + db.escape(data.account) + ' AND `password` = ' + db.escape(password));
        return results;
    },
    // 新增user功能
    add_user: async(data) => {
        try{
            let password = md5(data.password);
            const [results, fields] = await db.n_query('INSERT INTO users(account, password) VALUES(' + db.escape(data.account) + ', ' + db.escape(password) + ')');
            return results;
        }catch(err){
            clog(`新增帳號失敗,data:${JSON.stringify(data)}`);
            clog(err.message, 50);
            return false;
        }
    },
}

module.exports = userModel