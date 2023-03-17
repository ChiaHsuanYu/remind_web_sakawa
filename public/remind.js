let btn = document.getElementById("btn");
let userInfo = localStorage.getItem('userInfo');

// 列表上一頁
function remind_last_page(pageId, countId) {
    let data = check_last_page(pageId, countId);
    query_data(data['page'], data['page_count']);
}

// 列表下一頁
function remind_next_page(pageId, countId) {
    let data = check_next_page(pageId, countId);
    query_data(data['page'], data['page_count']);
}

function cancel_remind() {
    $('#editModal').modal('hide');
    document.getElementById("edit_name").value = "";
    document.getElementById("edit_time").value = "";
    document.getElementById("edit_desc").value = "";
}

function open_editNote(remind_data) {
    $('#editModal').modal('show');
    document.getElementById("edit_id").value = remind_data['id'];
    document.getElementById("edit_name").value = remind_data['name'];
    document.getElementById("edit_time").value = datetimeToDataTime(remind_data['datetime']);
    document.getElementById("edit_desc").value = remind_data['description'];
}

// 點擊次數
// btn.addEventListener('click', function(e) {
//     let count = document.getElementById("count");
//     let str = count.innerHTML;
//     if (!str) {
//         str = 0;
//     }
//     let obj = {
//         count: str
//     };
//     let result = call_api('/api/click', obj);
//     if (result['status']) {
//         count.innerHTML = result['data'];
//     }
// });

// 登出
function logout() {
    let obj = {};
    let result = call_api('/api/logout', obj);
    if (result['status']) {
        localStorage.removeItem('userInfo');
        alert(result['msg']);
        location.href = './login';
    }
}

// 查詢資料
function query_data(page, page_count) {
    let userInfo = localStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    let obj = {
        userId: userInfo['id'],
        page: page,
        page_count: page_count,
    };
    let result = call_api('/api/query_data', obj);
    if (result['status']) {
        remind_data(obj, result['data']);
    } else {
        remind_noData();
    }
}

// 查詢資料-繪製列表
function remind_data(obj, data) {
    let total = data['total'];
    data = data['data'];
    let tab = "";
    tab = '<table class="table table-bordered">';
    tab += '<thead>';
    tab += '<tr class="remind_tr">';
    tab += '<th scope="col">No</th>';
    tab += '<th scope="col">事件名稱</th>';
    tab += '<th scope="col">提醒時間</th>';
    tab += '<th scope="col">提醒事項</th>';
    tab += '<th scope="col">建立時間</th>';
    tab += '<th scope="col">功能</th>';
    tab += '</tr>';
    let no = (obj.page - 1) * obj.page_count;
    data.forEach(element => {
        no++;
        let datetime = datetimeToDataTime(element['datetime']);
        let createTime = datetimeToDataTime(element['createTime']);
        let description = '-';
        if (element['description']) {
            description = element['description'];
        }
        let remind_data = JSON.stringify(element);
        let edit_btn = "<button class='button inline_block' onclick='open_editNote(" + remind_data + ")'>修改</button>";
        let del_btn = "<button class='button inline_block' onclick='del_remind(" + remind_data + ")'>刪除</button>";
        tab += '<tr>';
        tab += '<th scope="col">' + no + '</th>';
        tab += '<th scope="col">' + element['name'] + '</th>';
        tab += '<th scope="col">' + datetime + '</th>';
        tab += '<th scope="col">' + description + '</th>';
        tab += '<th scope="col">' + createTime + '</th>';
        tab += '<th scope="col">' + edit_btn + del_btn + '</th>';
        tab += '</tr>';
    });
    tab += '</thead>';
    tab += '</table>';
    $("#remindAll").html(tab);
    document.getElementById('total_count').innerHTML = '資料總筆數：' + total;
    let hideobj = document.getElementById("allPageCountBox");
    if (total) {
        let total_page = Math.ceil(total / obj.page_count);
        page_count_select(total_page, obj.page, obj.page_count);
        hideobj.style.display = "inline-block"; //顯示筆數頁數層 
    } else {
        hideobj.style.display = "none"; //隱藏筆數頁數層 
    }
}

function remind_noData() {
    let tab = "";
    tab = '<table class=table table-bordered">';
    tab += '<thead>';
    tab += '<tr class="remind_tr">';
    tab += '<th scope="col">No</th>';
    tab += '<th scope="col">事件名稱</th>';
    tab += '<th scope="col">提醒時間</th>';
    tab += '<th scope="col">提醒事項</th>';
    tab += '<th scope="col">功能</th>';
    tab += '</tr>';
    tab += '<tr>';
    tab += '<th colspan="5" scope="col">查無資料</th>';
    tab += '</tr>';
    tab += '</thead>';
    tab += '</table>';
    $("#remindAll").html(tab);
    document.getElementById('total_count').innerHTML = '資料總筆數：0';
    let hideobj = document.getElementById("allPageCountBox");
    hideobj.style.display = "none"; //隱藏筆數頁數層 
}

// 發送表單
function add_form() {
    document.getElementById('error').innerHTML = "";
    let name = document.getElementById("name").value
    let time = document.getElementById("time").value
    let desc = document.getElementById("desc").value
    let page = document.getElementById('list_page').value;
    let page_count = document.getElementById('list_page_count').value;
    time = datetimeToDataTime(time);
    let obj = {
        name: name,
        time: time,
        desc: desc
    };
    let result = call_api('/api/add_form', obj);
    if (!result['status']) {
        document.getElementById('error').innerHTML = result['msg'];
    } else {
        query_data(page, page_count);
    }
}

// 刪除提醒事項
function del_remind(remind_data) {
    let page = document.getElementById('list_page').value;
    let page_count = document.getElementById('list_page_count').value;
    if (confirm('確定刪除提醒事項「' + remind_data["name"] + '」?')) {
        let obj = {
            id: remind_data["id"],
        };
        let result = call_api('/api/del_remind', obj);
        if (result['status']) {
            document.getElementById('page_status').innerHTML = '';
            query_data(page, page_count);
        } else {
            alert(result['msg']);
        }
    }
}

// 修改提醒事項
function edit_remind() {
    let id = document.getElementById("edit_id").value
    let name = document.getElementById("edit_name").value
    let time = document.getElementById("edit_time").value
    let desc = document.getElementById("edit_desc").value
    let page = document.getElementById('list_page').value;
    let page_count = document.getElementById('list_page_count').value;
    let obj = {
        id: id,
        name: name,
        time: time,
        desc: desc
    };
    let result = call_api('/api/edit_remind', obj);
    if (result['status']) {
        $('#editModal').modal('hide');
        query_data(page, page_count);
    } else {
        document.getElementById('edit_error').innerHTML = result['msg'];
    }
}