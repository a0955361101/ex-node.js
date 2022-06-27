require("dotenv").config();
const express = require('express')
const multer = require('multer');
const upload = require('./module/upload-imgs');
const session = require('express-session')
const app = express()


app.post('/try-upload',upload.single('avatar'),(req,res)=>{
    res.json(req.file)
})

app.post('/try-uploads',upload.array('photos'),(req,res)=>{
    res.json(req.files)
})

app.use(session({
    saveUninitialized:false,
    resave:false,
    secret:'fasfjoijfeew12few1f1ew3f13ew1few',
   
}))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use((req, res, next)=>{
    res.locals.shinder = '哈囉';
    next();
});

app.get('/try-session',(req,res)=>{
    req.session.my_var = req.session.my_var || 0
    req.session.my_var++;
    res.json({
        my_var:req.session.my_var,
        session:req.session
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

app.use(express.static('public'))

app.use('/bootstrap',express.static('node_modules/bootstrap/dist'))
app.use((req,res)=>{
    
    res.send(`<h2>404 - 找不到網頁</h2>
            <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt=""/>
    `)
})

app.listen(process.env.PORT, ()=>{
    console.log(`start server:${process.env.PORT} `)
})

