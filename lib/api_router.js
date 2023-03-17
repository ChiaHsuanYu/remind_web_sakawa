// @ts-check
const router = require('./router'); //頁面router
const express = require('express');
const { form_validation } = require('./middleware/form_validation.js');


//將request進來的data 轉成 json()
let jsonParser = express.json();
// let urlencodedParser = express.urlencoded({ extended: false });

// controller
const loginController = require('./controller/loginController');
const remindController = require('./controller/remindController');

// 登入api
router.post('/api/login', jsonParser,
    form_validation('account', '帳號', 'notEmpty|isLength[3,16]'),
    form_validation('password', '密碼', 'notEmpty|isLength[5,16]'),
    loginController.login);

// 登出api
router.post('/api/logout', loginController.logout);

// 註冊api
router.post('/api/register', jsonParser,
    form_validation('account', '帳號', 'notEmpty|isLength[3,16]'),
    form_validation('password', '密碼', 'notEmpty|isLength[5,16]'),
    form_validation('check_password', '確認密碼', 'notEmpty|isLength[5,16]|callback_check_pass'),
    loginController.register);

// 點擊次數api
router.post('/api/click', verifyToken, jsonParser, remindController.click);

// 新增提醒事項api
router.post('/api/add_form', verifyToken, jsonParser,
    form_validation('name', '名稱', 'notEmpty'),
    form_validation('time', '提醒時間', 'notEmpty|callback_timestamp_validation'),
    form_validation('desc', '提醒事項', 'notEmpty'),
    remindController.add_form);

// 刪除提醒事項api
router.post('/api/del_remind', verifyToken, jsonParser,
    form_validation('id', 'ID', 'notEmpty'),
    remindController.del_remind);

// 修改提醒事項api
router.post('/api/edit_remind', verifyToken, jsonParser,
    form_validation('id', 'ID', 'notEmpty'),
    form_validation('name', '名稱', 'notEmpty'),
    form_validation('time', '提醒時間', 'callback_timestamp_validation'),
    form_validation('desc', '提醒事項', 'notEmpty'),
    remindController.edit_remind);

// 查詢提醒列表api
router.post('/api/query_data', verifyToken, jsonParser, remindController.query_data);

// 驗證token
function verifyToken(req, res, next) {
    let bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(' ');
        let bearerToken = bearer[1];
        if (bearerToken != req.session.userInfo.token) {
            let result = {
                status: 0,
                msg: "token驗證失敗",
            };
            res.sendStatus(403);
            res.end(JSON.stringify(result));
        } else {
            req.token = bearerToken;
            next();
        }
    } else {
        res.sendStatus(403);
    }
}

// 輸出router設置
module.exports = router;