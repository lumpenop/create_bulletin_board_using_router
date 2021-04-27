
const Alert = require('alert');
const mysql = require('mysql');
const express = require('express');
const app = express();
const nunjucks = require('nunjucks');
const board = require('./routes/board')
require('dotenv').config();
const env = process.env;
const port = env.SERVER_PORT;


app.set('view engine', 'html');
nunjucks.configure('views', {
    express:app,
})
app.use(express.static('public'));
app.use(express.urlencoded({extended:false}));
app.use('/board', board);



app.listen(port, ()=>{
    console.log(`say hive! port:${port}`);
})