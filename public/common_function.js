function gotohref(path) {
    location.href = path;
}

function parseCookie() {
    let cookieObj = {};
    let cookieAry = document.cookie.split(';');
    let cookie;

    for (let i = 0, l = cookieAry.length; i < l; ++i) {
        cookie = jQuery.trim(cookieAry[i]);
        cookie = cookie.split('=');
        cookieObj[cookie[0]] = cookie[1];
    }

    return cookieObj;
}

function getCookie(name) {
    let value = parseCookie()[name];
    if (value) {
        value = decodeURIComponent(value);
    }

    return value;
}

// HTTP request
function http_request(path, data) {
    let xhr = new XMLHttpRequest();
    xhr.open('post', path, true) //啟動請求，url可以是相對於執行程式碼的當前頁面
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(JSON.stringify(data));
    let result = [];
    xhr.onload = function() {
        if (xhr.status == 200) {
            let response = xhr.response;
            response = JSON.parse(response);
            result = response;
        } else {
            console.log(xhr);
            console.log("失敗");
            result['status'] = 0;
            result['message'] = "連線失敗";
        }
    };
    return result;
}

//呼叫API
function call_api(api_name, data_obj) {
    let token = '';
    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token');
    }
    let result = [];
    $.ajax({
        cache: false,
        async: false,
        url: api_name,
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(data_obj),
        success: function(json) {
            json = JSON.parse(json);
            result = json;
        },
        error: function(xhr, status, error) {
            result['status'] = 0;
            result['message'] = "連線失敗";
            console.log("Error    ==================    API Response    ==================");
            console.log(xhr.responseText);
            console.log(error);
        }
    });
    return result;
}

// 日期時間轉換為日期
function datetimeToDataTime(datetime) {
    let NowTime = new Date(datetime);
    let year = NowTime.getFullYear();
    let month = (NowTime.getMonth() + 1 < 10 ? '0' : '') + (NowTime.getMonth() + 1);
    let date = (NowTime.getDate() < 10 ? '0' : '') + NowTime.getDate();
    let hours = (NowTime.getHours() < 10 ? '0' : '') + NowTime.getHours();
    let minutes = (NowTime.getMinutes() < 10 ? '0' : '') + NowTime.getMinutes();
    let seconds = (NowTime.getSeconds() < 10 ? '0' : '') + NowTime.getSeconds();
    date = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return date;
}

//延遲執行(秒)
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function page_count_select(total_page, page, count) {
    let pageSelect = document.getElementById('list_page');
    let countSelect = document.getElementById('list_page_count');
    pageSelect.innerHTML = '';
    countSelect.innerHTML = '';
    for (let i = 1; i <= total_page; i++) {
        addOption(pageSelect, i, i);
    }
    $('#list_page').val(page);
    for (let i = 5; i <= 20; i = i + 5) {
        addOption(countSelect, i, i);
    }
    $('#list_page_count').val(count);
}

function addOption(pageSelect, text, value) {
    let option = document.createElement("option");
    option.text = text;
    option.value = value;
    pageSelect.options.add(option);
}

// 列表上一頁
function check_last_page(pageId, countId) {
    document.getElementById("page_status").innerHTML = '';
    let page = document.getElementById(pageId).value;
    let page_count = document.getElementById(countId).value;
    page = parseInt(page);
    // 檢查是否已在第1頁
    if (page > 1) {
        page = page - 1;
    } else {
        document.getElementById("page_status").innerHTML = '查無上頁';
    }
    let data = {
        'page': page,
        'page_count': page_count,
    };
    return data;
}

// 列表下一頁
function check_next_page(pageId, countId) {
    document.getElementById("page_status").innerHTML = '';
    let page = document.getElementById(pageId).value;
    let page_count = document.getElementById(countId).value;
    let array = new Array(); //定义数组 
    // 取得所有頁數
    $("#" + pageId + " option").each(function() {
        let txt = $(this).val(); //获取option值 
        if (txt != '') {
            txt = parseInt(txt);
            array.push(txt); //添加到数组中
        }
    });

    let max_page = Math.max.apply(null, array); // 取得最終頁
    page = parseInt(page);
    // 檢查是否已在最終頁
    if (page < max_page) {
        page = page + 1;
    } else {
        document.getElementById("page_status").innerHTML = '查無下頁';
    }
    let data = {
        'page': page,
        'page_count': page_count,
    };
    return data;
}