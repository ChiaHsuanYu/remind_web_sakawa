const { check, validationResult } = require('express-validator');

// 進行表單驗證
function switch_rules(field, label, rules, param, verify_array) {
    // 判斷label是否有賦值
    label = typeof label === '' ? field : label;
    label = '「' + label + '」';
    // 判斷驗證規則(callback_為自定義驗證規則)
    switch (rules) {
        case 'notEmpty':
            verify_array.push(check(field).notEmpty().withMessage(label + `為必填欄位`));
            break;
        case 'isLength':
            let set = { min: param[0], max: param[1] }
            verify_array.push(check(field).isLength(set).withMessage(label + `限制字元範圍為${param[0]}-${param[1]}字元`))
            break;
        case 'callback_check_pass':
            verify_array.push(
                check(field).custom((value, { req }) => {
                    if (value != req.body.password) {
                        throw new Error(`兩次輸入的密碼不相同`);
                    }
                    return true;
                })
            )
            break;
        case 'callback_timestamp_validation':
            verify_array.push(
                check(field).matches(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/).withMessage(label + `格式錯誤`),
            )
            break;
    }
    return verify_array;
}

module.exports = {
    // 解析待驗證規則
    form_validation: function(field, label = '', rules = '') {
        if (typeof rules != 'string') {
            result = {
                status: 0,
                msg: "表單驗證規則格式錯誤",
            };
            res.end(JSON.stringify(result));
        }
        // 取得所有驗證規則
        rules = rules.split('|');
        let verify_array = [];
        // 依序驗證各規則
        rules.forEach(element => {
            param = [];
            // 檢查是否有帶參數
            if (element.includes('[') && element.includes(']')) {
                let param_str = element.split('[');
                element = param_str[0];
                param_str = param_str[1].split(']');
                param = param_str[0].split(',');
            }
            verify_array = switch_rules(field, label, element, param, verify_array);
        });
        return verify_array;
    },
    check_validator: function(req) {
        let errors = validationResult(req)
        let msg = '';
        if (!errors.isEmpty()) {
            this.count = errors.array().length;
            errors.array().forEach((element, index) => {
                msg = msg + element['msg'];
                if (index + 1 != this.count) {
                    msg = msg + "<br>";
                }
            });
        }
        return msg;
    }
}