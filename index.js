require("dotenv").config();
const express = require('express')

const app = express()

app.set("view engine", "ejs");

app.use(express.static('public'))

app.use('/bootstrap',express.static('node_modules/bootstrap/dist'))

app.get('/',(req,res)=>{
    res.render('main', {name:'我是Shi'})
})



app.use((req,res)=>{
    
    res.send(`<h2>404 - 找不到網頁</h2>
            <img src="/imgs/6c0519f6e0e0d42e458daef829c74ae4.jpg" alt=""/>
    `)
})

app.listen(process.env.PORT, ()=>{
    console.log(`start server:${process.env.PORT} `)
})

