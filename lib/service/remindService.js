// @ts-check
const remindModel = require('../model/remindModel');
const remindSchedule = require('../../remind_schedule');
const { clog } = require('sakawa-core/hdl-logger');
const xss = require("xss");
const fs = require('fs');
const config = require('../config');

const remindService = {
    // 新增提醒事件
    add_form: async(content) => {
        clog(`新增事件開始`, 50);
        let result = {};
        let path = config.file.path;
        let file = config.file.file_name;
        let file_path = path + "/" + file;
        // if (!fs.existsSync(file_path)) {
        //     let data = [];
        //     data.push(content);
        //     fs.writeFile(file_path, JSON.stringify(data), err => {
        //         if (err) {
        //             console.error(err);
        //             return;
        //         }
        //     });
        // } else {
        //     fs.readFile(file_path, 'utf8', function(err, data) {
        //         if (err) {
        //             console.log(err);
        //             return;
        //         }
        //         if (data) {
        //             data = JSON.parse(data);
        //             data.push(content);
        //         } else {
        //             let data = [];
        //             data.push(content);
        //         }
        //         fs.writeFile(file_path, JSON.stringify(data), err => {
        //             if (err) {
        //                 console.error(err);
        //                 return;
        //             }
        //         });
        //     });
        // }
        // 新增提醒事件
        content.name = xss(content.name);
        content.time = xss(content.time);
        content.desc = xss(content.desc);
        let insertId = await remindModel.add_remind(content);
        if (!insertId) {
            result = {
                status: 0,
                msg: '新增失敗',
            };
            clog(`新增事件失敗, data: ${JSON.stringify(content)}`, 50);
            return result;
        }
        content.id = insertId;
        let schedule_result = remindSchedule.add_schedule(content);
        result = {
            status: 0,
            msg: '新增成功',
        };
        clog(`新增事件結束, data: ${JSON.stringify(content)}`, 50);
        return result;
    },
    // 修改提醒事件
    edit_remind: async(content) => {
        clog(`修改事件開始`, 50);
        let result = {};
        let update_result = await remindModel.update_data_by_id(content);
        if (!update_result) {
            result = {
                status: 0,
                msg: '修改失敗',
            };
            clog(`修改事件失敗, data: ${JSON.stringify(content)}`, 50);
            return result;
        }
        result = {
            status: 1,
            msg: '修改成功',
        };
        clog(`修改事件結束, data: ${JSON.stringify(content)}`, 50);
        return result;
    },
    // 刪除提醒事件
    del_remind: async(id) => {
        let del_result = await remindModel.update_isDeleted_by_id(id);
        if (!del_result) {
            let result = {
                status: 0,
                data: '刪除失敗',
            };
            clog(`刪除提醒事件失敗, remind_id: ${JSON.stringify(id)}`, 50);
            return result;
        }
        let result = {
            status: 1,
            data: '刪除成功',
        };
        clog(`刪除提醒事件, remind_id: ${id}`, 50);
        return result;
    },
    // 取得列表
    query_data: async(data) => {
        clog(`取得提醒事件, userId: ${data.userId}`, 50);
        let result = {};
        // 取得事件總數 by userId
        let remind_count = await remindModel.query_data_count_by_userId(data.userId);
        if (!remind_count) {
            result = {
                status: 0,
                data: '查無資料',
            };
            return result;
        }
        // 取得事件資料 by userId
        data.total = remind_count[0]['total'];
        let remind_data = await remindModel.query_data_limit_by_userId(data);
        if (remind_data) {
            result = {
                status: 1,
                data: remind_data,
            };
        }else{
            result = {
                status: 0,
                data: '查詢失敗',
            };
        }
        return result;
    }
}

// 輸出 userController
module.exports = remindService