const express = require('express')
const app = express()
const path = require('path')

app.use(express.json())

app.use(express.urlencoded({express:true}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view enjine','ejs')

app.get("/",function(req,res){
    res.render("index.ejs")
})

app.get("/profile/:username",function(req,res){
    res.send(`welcome, ${req.params.username}`)
})

app.get("/profile/:username/:age",function(req,res){
    res.send(`welcome ${req.params.username} you are ${req.params.age} year old`)
})


app.listen(3000,function(){
    console.log("wait it's running");
})