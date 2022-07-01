const express = require('express')
const db = require(__dirname + "/../module/mysql-connect")
const {
    toDateString,
    toDatetimeString,
} = require(__dirname + '/../module/date-tools')
const router = express.Router()

const getListHandler = async (req,res)=>{
    let output = {
        perPage:5,
        page:1,
        totalRows:0,
        totalPages:0,
        rows:[],
        error:'',
        query: {},
        code:0,
    }

    let page = +req.query.page || 1

    let search = req.query.search || '';
    let beginDate = req.query.beginDate || '';
    let endDate = req.query.endDate || '';
    
    let where = ' WHERE 1 ';
    if(search){
        where += ` AND course_name LIKE ${ db.escape('%'+search+'%') } `;
        output.query.search = search;
        output.showTest = db.escape('%'+search+'%'); // 測試, 查看
    }

    if(page<1){
        output.code = 410
        output.error = '頁碼太小'
        return output
    }

    // if(beginDate){
    //     const mo = moment(beginDate);
    //     if(mo.isValid()){
    //         where += ` AND birthday >= '${mo.format('YYYY-MM-DD')}' `;
    //         output.query.beginDate = mo.format('YYYY-MM-DD');
    //     }
    // }
    // if(endDate){
    //     const mo = moment(endDate);
    //     if(mo.isValid()){
    //         where += ` AND birthday <= '${mo.format('YYYY-MM-DD')}' `;
    //         output.query.endDate = mo.format('YYYY-MM-DD');
    //     }
    // }

    const sql01 = `SELECT COUNT(1) totalRows FROM course ${where}`
    const [[{totalRows}]] =await db.query(sql01)

    let totalPages = 0
    if(totalRows){
        totalPages = Math.ceil(totalRows/output.perPage)
        if(page>totalPages){
            output.totalPages = totalPages
            output.code= 420
            output.error = '頁碼太大'
            return output
        }
        const sql02 = `SELECT * FROM course ${where} LIMIT ${(page-1)*output.perPage},${output.perPage}`
        const [r2] = await db.query(sql02)
        // r2.forEach(el => el.birthday = toDateString(el.birthday))
        output.rows = r2
    }

output.code = 200
    output = {...output ,page,totalRows, totalPages}

   return output
}


router.get('/add', async (req, res)=>{
    res.render('course/add');
});

router.post('/add',  async (req, res)=>{
//     // const schema = Joi.object({
//     //     name: Joi.string()
//     //         .min(3)
//     //         .required()
//     //         .label('姓名必填'),
//     //     email: Joi.string()
//     //         .email()
//     //         .required(),
//     //     mobile: Joi.string(),
//     //     birthday: Joi.string(),
//     //     address: Joi.string(),
//     // });

//     // res.json( schema.validate(req.body, {abortEarly: false}) );

    const sql = "INSERT INTO `course`( `course_name`, `course_price`,  `course_content`, `course_people`, `course_material`) VALUES (?,?,?,?,?)"
const {course_name, course_price,  course_content, course_people, course_material} = req.body

const [result] = await db.query(sql,[course_name, course_price,  course_content, course_people, course_material])
console.log(result);
res.json(result)


});





router.get('/',async(req,res)=>{
    const output = await getListHandler(req,res)
    switch(output.code){
        case 410:
            return res.redirect(`?page=1`)
            break;
        case 420:
            return res.redirect(`page=${output.totalPages}`)
            break;
    }
    res.render('course/index',output)
})


router.get('/api', async(req,res)=>{
    const output = await getListHandler(req, res);
    res.json(output);
})



module.exports = router