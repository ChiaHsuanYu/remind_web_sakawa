// @ts-check
const jwt = require('jsonwebtoken');
const commonController = require('./commonController');
const loginService = require('../service/loginService');
const form_validation = require('../middleware/form_validation');
const { clog } = require('sakawa-core/hdl-logger');
const xss = require("xss");

const loginController = {
    // 登入
    login: async(req, res) => {
        // 檢查資料格式
        let result = commonController.check_validation(req);
        if(result.status == '0'){
            clog(`登入失敗, errors: ${JSON.stringify(result.msg)}`, 50);
            return res.end(JSON.stringify(result));
        }
        let data = {
            account: xss(req.body.account),
            password: xss(req.body.password),
        };
        result = await loginService.login(data);
        if(result['status']){ // 將使用者資訊存入session及cookie
            req.session.userInfo = result['data'];
            res.cookie('userInfo', result['data']);
        }
        return res.end(JSON.stringify(result));
    },
    // 註冊
    register: async(req, res) => {
        // 檢查資料格式
        let result = await commonController.check_validation(req);
        if(result.status == '0'){
            clog(`註冊失敗, errors: ${JSON.stringify(result.msg)}`, 50);
            return res.end(JSON.stringify(result));
        }
        let data = {
            account: xss(req.body.account),
            password: xss(req.body.password),
        };
        result = await loginService.register(data);
        res.end(JSON.stringify(result));
    },
    // 登出
    logout: (req, res) => {
        clog(`使用者登出, data: ${JSON.stringify(req.session.userInfo)}`, 50);
        req.session.userInfo = null;
        res.clearCookie('userInfo', { path: '/' });
        let result = {
            status: 1,
            msg: '登出成功'
        };
        res.end(JSON.stringify(result));
    },
    // 取得token
    jwt_sign: (data) => {
        jwt.sign({ data }, 'secretkey', (err, token) => {
            if (err) return false;
            return token;
        });
    }
}

// 輸出 userController
module.exports = loginController