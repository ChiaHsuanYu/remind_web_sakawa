// @ts-check
//取得SakawaMysql實體
const db = require('sakawa-core/database/database-factory').getDatabase('demo_nodejs');
const { clog } = require('sakawa-core/hdl-logger');

const remindModel = {
    add_remind: async(data) => {
        try {
            let insertData = {
                userId: data.userId, 
                name: data.name,
                datetime: data.time,
                description: data.desc,
            };
            const [success, results, fields] = await db.n_sql_insert('remind',insertData);
            return results.insertId;
        } catch (err) {
            clog(`新增事件失敗, results: ${JSON.stringify(data)}`, 50);
            clog(err.message, 50);
            return false;
        }
    },
    // 取得限制筆數資料
    query_data_limit_by_userId: async(data) => {
        data.page = Number(data.page); //字串轉數字
        data.page_count = Number(data.page_count); //字串轉數字
        let pageStar = (data.page - 1) * data.page_count; //本頁起始紀錄筆數
        try {
            const [results, fields] = await db.n_query('SELECT * FROM `remind` WHERE `isDeleted` = 0 AND `userId` = ' + db.escape(data.userId) + ' ORDER BY `createTime` DESC LIMIT ' + db.escape(pageStar) + ',' + db.escape(data.page_count));
            let result = {
                total: data.total,
                data: results
            };
            return result;
        } catch (err) {
            clog(`取得事件資料失敗, query: ${JSON.stringify(data)}`, 50);
            clog(err.message, 50);
            return false;
        }

    },
    // 取得資料總數
    query_data_count_by_userId: async(userId) => {
        try {
            // 取得資料總數
            const [results, fields] = await db.n_query('SELECT COUNT(`id`) as total FROM `remind` WHERE `isDeleted` = 0 AND `userId` = ' + db.escape(userId));
            return results;
        } catch (err) {
            clog(`取得事件總數失敗, userId: ${userId}`, 50);
            clog(err.message, 50);
            return false;
        }
    },
    // 刪除提醒事件
    update_isDeleted_by_id: async(id) => {
        try {
            const [results, fields] = await db.n_query('UPDATE `remind` SET `isDeleted` = 1 WHERE `id` = ' + db.escape(id));
            return results;
        } catch (err) {
            clog(`刪除提醒事件失敗, id: ${id}`, 50);
            clog(err.message, 50);
            return false;
        }
    },
    // 刪除提醒事件
    update_data_by_id: async(data) => {
        try {
            const [results, fields] = await db.n_query('UPDATE `remind` SET `name` = ' + db.escape(data.name) + ',`datetime` = ' + db.escape(data.time) + ' ,`description` = ' + db.escape(data.desc) + ' WHERE `id` = ' + db.escape(data.id));
            return results;
        } catch (err) {
            clog(`更新提醒事件失敗,data:${JSON.stringify(data)}`);
            clog(err.message, 50);
            return false;
        }
    }

}
module.exports = remindModel