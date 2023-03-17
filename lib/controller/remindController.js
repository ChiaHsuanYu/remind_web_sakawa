// @ts-check
const commonController = require('./commonController');
const remindService = require('../service/remindService');
const { clog } = require('sakawa-core/hdl-logger');
const xss = require("xss");

const remindController = {
    click: (req, res) => {
        // 接收HTTP request
        let data = req.body.count;
        data++;
        let result = {
            status: 1,
            data: data
        };
        res.end(JSON.stringify(result));
    },
    // 新增提醒事件
    add_form: async(req, res) => {
        // 檢查資料格式
        let result = await commonController.check_validation(req);
        if(result.status == '0'){
            clog(`新增事件的資料格式錯誤, errors: ${JSON.stringify(result.msg)}`, 50);
            return res.end(JSON.stringify(result));
        }
        let content = {
            userId: req.session.userInfo.id,
            name: req.body.name,
            time: req.body.time,
            desc: req.body.desc
        };
        result = await remindService.add_form(content);
        res.end(JSON.stringify(result));
    },
    // 修改提醒事件
    edit_remind: async(req, res) => {
        // 檢查資料格式
        let result = await commonController.check_validation(req);
        if(result.status == '0'){
            clog(`修改事件的資料格式錯誤, errors: ${JSON.stringify(result.msg)}`, 50);
            return res.end(JSON.stringify(result));
        }
        let content = {
            id: req.body.id,
            name: xss(req.body.name),
            time: xss(req.body.time),
            desc: xss(req.body.desc)
        };
        result = await remindService.edit_remind(content);
        res.end(JSON.stringify(result));
    },
    // 刪除提醒事件
    del_remind: async(req, res) => {
        let result = await remindService.del_remind(req.body.id);
        res.end(JSON.stringify(result));
    },
    // 取得列表
    query_data: async(req, res) => {
        let result = await remindService.query_data(req.body);
        res.end(JSON.stringify(result));
    }
}

// 輸出 userController
module.exports = remindController