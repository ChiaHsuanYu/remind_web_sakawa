// @ts-check
const jwt = require('jsonwebtoken');
const userModel = require('../model/userModel');
const { clog } = require('sakawa-core/hdl-logger');

const loginService = {
    // 登入
    login: async(data) => {
        let result = {};
        let userInfo = await userModel.check_user(data); // 判斷登入帳號是否合法
        if (!userInfo.length) {
            result = {
                status: 0,
                msg: '登入失敗，帳號密碼錯誤'
            };
            clog(`登入失敗,帳號密碼錯誤, data: ${JSON.stringify(data)}`, 50);
            return result;
        }
        let token = await jwt.sign({ userInfo }, 'secretkey'); // 取得token
        if (!token) {
            result = {
                status: 0,
                msg: '驗證失敗，請聯絡系統管理人員'
            };
            clog(`token驗證失敗, userInfo: ${JSON.stringify(userInfo)}`, 50);
            return result;
        }
        userInfo = userInfo[0];
        userInfo.token = token;
        result = {
            status: 1,
            data: userInfo,
        };
        clog(`使用者登入成功, data: ${JSON.stringify(userInfo)}`, 50);
        return result;
    },
    // 註冊
    register: async(data) => {
        let result = {};
        let check_result = await userModel.check_user_by_account(data); // 判斷登入帳號是否重複
        if (check_result.length) {
            result = {
                status: 0,
                msg: '帳號已存在，請重新輸入',
            };
            clog(`註冊帳號已存在, data: ${JSON.stringify(data)}`, 50);
            return result;
        }
        let add_result = await userModel.add_user(data);  // 新增帳號
        if (!add_result) {
            result = {
                status: 0,
                msg: "新增失敗",
            };
            return result;
        }
        result = {
            status: 1,
            msg: '新增成功',
        };
        clog(`新增帳號成功, data: ${JSON.stringify(data)}`, 50);
        return result;
    },
    // 取得token
    jwt_sign: (data) => {
        jwt.sign({ data }, 'secretkey', (err, token) => {
            if (err) return false;
            return token;
        });
    }
}

// 輸出 loginService
module.exports = loginService