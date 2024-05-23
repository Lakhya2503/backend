const express = require('express')
const app = express()

app.use( function(req,res,next){
    console.log("Resopending karega");
    next()
})

app.use( function(req,res,next){
    console.log("Resopending karega thoda wait kar");
    next()
})

app.get("/",function(req,res){
    res.send("Hii guys")
})


app.get("/contact",function(req,res){
    res.send("contact me...")
})


app.get("/profile",function(req,res){
    res.send("profile dekh riya hai...")
})


// Error handling
// app.get("/profile",function(req,res,next){
//     return next(new Error("something went's wrong in  this"))
// })

// app.use((err, req, res, next) => {
//     console.error(err); 
//     res.status(500).send({ message: 'Something went wrong.' });
//   });


// install nodemone server for the direct changes 
// run the cammand (npm install nodemon --global)
// for show then run the cammand (npx nodemon "file name")


app.listen(3000);