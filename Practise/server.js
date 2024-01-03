const express= require("express");
const app= express();
const path= require("path");
const cookieParser=require('cookie-parser');
// const path=require('path');
const ejsMate=require('ejs-mate');
const session=require('express-session')
const flash=require('connect-flash');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(flash());


// For EJS
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// For Post Reequests
app.use(express.urlencoded({extended:true}));
app.use(express.json());

const port=3000;

const Session={secret:"ultimatepowerrenger",
    resave:false,
    saveUninitialized:true,    
};

app.use(session(Session));

// Cookie Session
app.use(cookieParser("secret"));

app.get("/testings",async(req,res)=>{
    let {name='anonymos'}=req.query;
    if(name!='anonymos'){
        req.flash("success","Got the name");
    }
    else{
        req.flash("fail","Didnt got the name");
    }
    console.log(name);
    res.redirect('/getCookie');
    // res.send(`${name}`);
});

app.get("/getCookie",(req,res)=>{
    res.locals.success=req.flash("success");
    res.locals.fail=req.flash("fail");
    res.render('show.ejs');
})


app.listen(port,()=>{
    console.log("Port is Listening");
})