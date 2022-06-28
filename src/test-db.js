const db = require(__dirname + '/../module/mysql-connect');


(async()=>{
    const [results] =await db.query("SELECT * FROM course LIMIT 3")

    console.log(results)
    process.exit()  
    // 結束行程
})();

