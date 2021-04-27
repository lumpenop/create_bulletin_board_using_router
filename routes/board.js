const express = require('express');
const router = express.Router();
const nunjucks = require('nunjucks');
const mysql = require('mysql');
require('dotenv').config();
const env = process.env;
const port = env.SERVER_PORT;




const connection = mysql.createConnection({
    host:env.DB_HOST,
    user: env.DB_USER,
    password: env.DB_PW,
    database:env.DB_NAME,
})

connection.connect();


router.get('/', (req, res)=>{
    connection.query(`select idx,id,subject,date_format(date, "%Y-%m-%d %T")as date,hit from board`, (error, results)=>{
        if(!error){
            res.render('board/list.html',{
                boardTable:results,
            })
        }else{
            console.log(error)
        }
    })
})

router.get('/write', (req, res)=>{
    let today = new Date();
    let year = today.getFullYear(); // 년도
    let month = today.getMonth() + 1;  // 월
    let date = today.getDate();  // 날짜
    let day = today.getDay();  // 요일
    let hour = today.getHours(); // 시
    let min = today.getMinutes();  // 분
    let sec = today.getSeconds();  // 초
    res.render('board/write.html',{
        
        date: `${year}-${month}-${date} ${hour}:${min}:${sec}`,
    })
})

router.post('/write', (req, res)=>{
    connection.query(`insert into board(id, subject, content) \
    values('${req.body.id}', '${req.body.subject}', '${req.body.content}')`,
    (error, results)=>{
        if(error){
            console.log('view post error', error);
        }else{
            
            res.redirect(`view?num=${results.insertId}`);
        }
    });
})

router.get('/view',(req, res)=>{
    connection.query(`select idx,id,subject,content,date_format(date, "%Y-%m-%d %T")as date,hit from board\
    where idx=${req.query.num}`,(error, results)=>{
        if(error){
           console.log('view get error',error) 
        }else{
            res.render('board/view.html',{ 
                idx: results[0].idx,
                id : results[0].id,
                subject: results[0].subject,
                content:results[0].content,
                hit:results[0].hit,
                date:results[0].date,
            })
        }
    })
})

router.post('/modify',(req, res)=>{
    connection.query(`update board set subject='${req.body.subject}', content='${req.body.content}'\
    where idx=${req.body.idx}`, (error)=>{
        if(error){
            console.log('modify post error', error);
        }else{
            res.redirect(`view?num=${req.body.idx}`)
        }
    })
})

router.get('/modify', (req, res)=>{

    connection.query(`select idx, id, subject, date_format(date, "%Y-%m-%d %T")as date,\
    hit, content from board where idx=${req.query.num}`, (error, results)=>{
        if(!error){
            res.render('board/modify.html',{
                idx: results[0].idx,
                id: results[0].id,
                content: results[0].content,
                subject: results[0].subject,
                hit: results[0].hit,
                date: results[0].date
            })
        }else{
            console.log('modify get error', error);
        }
    })
})

router.get('/delete', (req, res)=>{
    connection.query(`delete from board where idx=${req.query.num}`, (error)=>{
        if(!error){
            res.redirect('/board');
        }else{
            console.log('delete post error', error);
        }
    })
})

module.exports = router;