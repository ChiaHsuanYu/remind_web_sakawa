// 程序持續監聽remind_schedule
const schedule = require('node-schedule');


const remindSchedule = {
    // 新增排程
    add_schedule: (data) => {
        const date = new Date(data.date);
        const job = {};
        job[data.id] = schedule.scheduleJob( date, function(){
            console.log(data.desc);
            job[data.id].cancel();
        });
    },
}
module.exports = remindSchedule;
