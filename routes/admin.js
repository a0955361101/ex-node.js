const express = require('express')
const router = express.Router()

router.get('/r1/:action?/:id?',(req,res)=>{
    res.json({
        url:req.url,
        baseUrl:req.baseUrl,
        originalUrl:req.originalUrl,
        params:req.params,
        code:'admin.js'
    })
})

router.get('/r2/:action?/:id?',(req,res)=>{
    res.json({
        url: req.url,
        params: req.params,
        code: 'admin.js',
    })
})

module.exports = router