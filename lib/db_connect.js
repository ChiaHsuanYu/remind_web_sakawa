const config = require('./config');
const dbFactory = require('sakawa-core/database/database-factory');

//第2個參數為自訂key值, 選填, 沒有設定時會預設以 default 做為key值
const db = dbFactory.addDatabase(config.db, 'demo_nodejs');

//其他檔案可以透過 require('./lib/db_connect') 取得 SakawaMysql 實體
//或是透過 dbFactory.getDatabase('demo_nodejs') 取得, 沒有指定 key 時會以預設 default 做為 key 取得 SakawaMysql 實體
module.exports = db;