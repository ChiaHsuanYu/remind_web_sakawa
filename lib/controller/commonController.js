// @ts-check
const jwt = require('jsonwebtoken');
const form_validation = require('../middleware/form_validation');
const loginService = require('../service/loginService');
const { clog } = require('sakawa-core/hdl-logger');
const xss = require("xss");

const commonController = {
    // 登入
    check_validation: function(req){
        let errors = form_validation.check_validator(req); // 檢查資料格式
        let result = {};
        if (errors) {
            result = {
                status: 0,
                msg: errors,
            };
        }
        return result;
    }
}

// 輸出 userController
module.exports = commonController