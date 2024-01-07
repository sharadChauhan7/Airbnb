const express= require("express");
const app= express();
const path= require("path");
const ejsMate=require("ejs-mate");
const methodOverride = require('method-override');
const myError = require("./utils/myErrors");
const cookieParser = require('cookie-parser');
const passport=require('passport');
const localStrategy=require('passport-local');

// Routs
const listings=require("./routs/listings.js");
const reviews=require("./routs/reviews.js");
const signup=require("./routs/signup.js");

const user=require("./modal/user.js");

const session=require('express-session')
const flash=require('connect-flash');

const sessionOption={
    secret:"ultiamteben10",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+1000*60*60*24*3,
        maxAge: 1000*60*60*24*3,
        httpOnly:true,
    }    
}
app.use(session(sessionOption));
app.use(flash());

app.use(methodOverride('_method'));


const port = 8000;

// For Static Files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));

// For Post Reequests
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// For EJS
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// For Cookies
app.use(cookieParser("secretcode"));

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// Flash Middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// Routs 

app.use("/listings",listings);
app.use("/listings/:id/review",reviews);
app.use('/',signup);

// Error Handling Middlewares

app.all("*",(req,res,next)=>{
    // console.log(req.signedCookies);
    next(new myError(404,"Page not Found"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some Error Occure"}=err;
    res.render("listings/Error.ejs",{who:"Error",message});
});

app.listen(port,()=>{
    console.log("Ports is Listening");
});