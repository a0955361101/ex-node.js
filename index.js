require("dotenv").config();
const express = require('express')
const multer = require('multer');
const upload = require('./module/upload-imgs');
const session = require('express-session')
const moment = require('moment-timezone')
const db = require(__dirname + '/module/mysql-connect');
const MysqlStore = require('express-mysql-session')(session);
const sessionStore = new MysqlStore({}, db);
const app = express()
const bcrypt = require('bcryptjs');


const {
    toDateString,
    toDatetimeString,
} = require(__dirname + '/module/date-tools');








app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'fasfjoijfeew12few1f1ew3f13ew1few',
    store: sessionStore,
    cookie:{
        maxAge:1800000, // 30 min
    }
   
}));

app.use((req, res, next)=>{
    // res.locals.shinder = '哈囉';
    res.locals.toDateString = toDateString;
    res.locals.toDatetimeString = toDatetimeString;
    res.locals.session = req.session;
    next();
})


app.post('/try-upload',upload.single('avatar'),(req,res)=>{
    res.json(req.file)
})

app.post('/try-uploads',upload.array('photos'),(req,res)=>{
    res.json(req.files)
})

app.use('/try-course',require(__dirname + '/routes/course'))
app.use(express.urlencoded({extended:false}))
app.use(express.json())


app.get('/try-session',(req,res)=>{
    req.session.my_var = req.session.my_var || 0
    req.session.my_var++;
    res.json({
        my_var:req.session.my_var,
        session:req.session
    })
})

app.get('/try-moment',(req,res)=>{
    const fm = 'YYYY-MM-DD HH:mm:ss'
    const m1 = moment ()
    const m2 = moment ('2022-02-29')

    res.json({
        m1:m1.format(fm),
        m1a:m1.tz('Europe/London').format(fm),
        m2:m2.format(fm),
        m2a:m2.tz('Europe/London').format(fm)
    })
})


// 區分大小寫
app.set('case sensitive routing', true);

app.get('/',(req,res)=>{
    res.render('main', {name:'我是Shi'})
})

app.get('/my-params1/:action/:id',(req,res)=>{
    res.json(req.params)
})
app.get('/my-params1/:action',(req,res)=>{
    res.json(req.params)
})
app.get('/my-params1/:action?/:id?',(req,res)=>{
    res.json(req.params)
})

app.get('/my-params2/*/*?',(req,res)=>{
    res.json(req.params)
})

app.get('/try.json',(req,res)=>{
    const data = require(__dirname + '/data/data01.json')
    console.log(data)
    res.locals.rows = data;
    res.render('try-json')
})

const adminRouter = require(__dirname + '/routes/admin')
app.use('/admin',adminRouter)
app.use(adminRouter)


app.get(/^\/hi\/?/i,(req,res)=>{
    res.send({url: req.url, code:'array'})
})

app.get(['/aaa','/bbb'],(req,res)=>{
    res.send({url: req.url, code:'array'});
})

app.get('/req.query',(req,res)=>{
    res.json(req.query)
})

app.post('/try-post',(req,res)=>{
    res.json(req.body)
})

app.route('/try-post-form')
    .get((req,res)=>{
        res.render('try-post-form')
    })
    .post((req,res)=>{
        const {email,password} = req.body;
        res.render('try-post-form',{email,password})
    })

app.set("view engine", "ejs");

app.route('/login')
    .get(async (req, res)=>{
        res.render('login');
    })
    .post(async (req, res)=>{
        const output = {
            success: false,
            error: '',
            code: 0,
        };
        const sql = "SELECT * FROM admin WHERE account=?";
        const [r1] = await db.query(sql, [req.body.account]);

        if(! r1.length){
            // 帳號錯誤
            output.code = 401;
            output.error = '帳密錯誤'
            return res.json(output)
        }
        //const row = r1[0];

        output.success = await bcrypt.compare(req.body.password, r1[0].password);
       
        if(! output.success){
            // 密碼錯誤
            output.code = 402;
            output.error = '密碼錯誤'
        }else {
            req.session.admin = {
                sid: r1[0].sid,
                account: r1[0].account,
            };
        }

        res.json(output);
    });

    app.get('/logout',(req,res)=>{
        delete req.session.admin
        res.redirect("/")
    })


app.use(express.static('public'))

app.use('/bootstrap',express.static('node_modules/bootstrap/dist'))
app.use("/joi", express.static("node_modules/joi/dist"));
app.use((req,res)=>{
    
    res.send(`<h2>404 - 找不到網頁</h2>
            <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt=""/>
    `)
})

app.listen(process.env.PORT, ()=>{
    console.log(`start server:${process.env.PORT} `)
})

