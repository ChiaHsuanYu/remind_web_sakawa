// @ts-check
// 引入檔案
const express = require('express');
const path = require('path');
const router = express.Router();

// 設置cookie=> res.cookie('userInfo', userInfo);
// 取得cookie=> req.signedCookies.userInfo
// signedCookies屬性包含由請求發送的已簽名的cookie，未簽名，可以在使用cookie-parser中間件時使用

router.get('/', function(req, res) {
    return res.redirect('/remind');
});

// 登入
// router.get('/sw', function(req, res) {
//     res.sendFile(path.join(__dirname, './sw.js'));
// });

// 登入
router.get('/login', function(req, res) {
    let userInfo = req.session.userInfo;
    if (userInfo) {
        return res.redirect('/remind');
    } else {
        res.sendFile(path.join(__dirname, './views/login.html'));
    }
});

// 註冊
router.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname, './views/register.html'));
});

// 登入成功，進入首頁(尚可加驗證的中介軟體,判斷token是否過期?)
router.get('/remind', function(req, res) {
    let userInfo = req.session.userInfo;
    if (userInfo) {
        // 驗證token，驗證失敗則強制跳轉至登入頁面
        if (userInfo.token) {
            res.sendFile(path.join(__dirname, './views/index.html'));
        } else {
            return res.redirect('/login');
        }
    } else {
        return res.redirect('/login');
    }
    // res.set('Content-Type', 'application/json') //設置響應header
    // res.json({ title: '登入成功，進入首頁', member: name, logstatus: isLogin });
});

router.get('*', function(req, res) {
    res.status(404);
    res.sendFile(path.join(__dirname, './views/404.html'));
})

// 輸出router設置
module.exports = router;