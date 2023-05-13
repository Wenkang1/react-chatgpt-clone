const PORT = 8001
const express = require('express')
const app = express()
app.use(express.json())
const cors = require('cors')
const request = require('request');
app.use(cors());
require('dotenv').config();

app.post('/completions', async (req,res)=>{
    const KEY = process.env.API_KEY;
    console.log("into completions pose reques")
    var proxy = {
        host: "localhost", //代理服务器地址
        port: 7890,//端口
    }
    
    const headers = {
        "Authorization": `Bearer ${KEY}`,
        "Content-Type": "application/json",
        "Host": "api.openai.com"
    }

    var payload = {
        model: "gpt-3.5-turbo",
        'messages': [{"role": "user", "content": req.body.message }],
        temperature: 0.7
    }
    request({
        url: 'https://api.openai.com/v1/chat/completions',
        method: 'POST',
        body: JSON.stringify(payload),
        proxy: proxy,
        timeout: 5000,
        headers: headers,
        encoding:'utf-8'
        },(err,response,body) => {
            if (err){
                console.error(err.status+err);
                res.send(err).status(500)
            }
            console.log(body)
            res.send(body).status(200)
        })   

});



app.post('/model', async (req,res)=>{

    console.log("into model with message " + req.body.message)
    var proxy = {
        host: "localhost", //代理服务器地址
        port: 7890,//端口
    }
    
    const headers = {
        "Authorization": `Bearer ${API_KEY}`,
        "Host": "api.openai.com"
    }

    request({
        url: 'https://api.openai.com/v1/models',
        proxy: proxy,
        headers: headers
        },(err,response,body) => {
            if (err){
                console.error(err);
                res.send(err).status(500)
            }
            console.log(body)
            res.send(body).status(200)
        })   

});

app.listen(PORT,() => console.log('server running on port ' + PORT))
