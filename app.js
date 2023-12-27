const express= require("express");
const app= express();
const path= require("path");
const Listing= require("./modal/index");
const ejsMate=require("ejs-mate");
const methodOverride = require('method-override');
const myError = require("./utils/myErrors");
const asyncWrap=require("./utils/asyncWrap");
const Review=require("./modal/review");

// const {listingValidation}=require("./schema.js");
app.use(methodOverride('_method'));


const port = 8000;

// For Static Files
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"public")));

// For Post Reequests
app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

// Testing Mode
app.get("/admin",(req,res)=>{
    res.render("listings/form.ejs",{who:"Create"});
})

// Listing  Route

app.get("/listings",asyncWrap(async (req,res)=>{
    let Listings= await Listing.find();
    res.render("listings/index.ejs",{Listings,who:"Home"});
}));

// Show Route
app.get("/listings/:id/show",asyncWrap(async (req,res)=>{
    let{id}=req.params;
    let listData= await Listing.findById(id);
    res.render("listings/show.ejs",{listData,who:"View"})
}));

// New Route
app.get("/listings/new",(req,res)=>{
    res.render("listings/form.ejs",{who:"Create"});
});

// Post Route
app.post("/listings",asyncWrap(async (req,res)=>{
    // let result=listingValidation.validate(req.body);
    // console.log(result);
    let newListing= new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
}));

// Edit Route
app.get("/listings/:id/edit",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    let List= await Listing.findById(id);
    res.render("listings/edit.ejs",{List,who:"Edit"});
}));

// Update Route
app.put("/listings/:id/edit", asyncWrap(async (req,res,next)=>{
        let {id}=req.params;
        await Listing.findByIdAndUpdate(id,req.body, {runValidators: true });
        res.redirect("/listings");
}));
// Delete Route
app.delete("/listings/:id/delete",asyncWrap(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// Review Route
app.post("/listings/:id/review",asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    console.log(req.body);
    let newReview=new Review(req.body);
    let listData= await Listing.findById(id);
    listData.reviews.push(data);
    
    await newReview.save();
    await listData.save();
    res.send("Review");
}));

app.get("/listings/:id/review",asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    let listData= await Listing.findById(id).populate("reviews");
    console.log(listData);
    res.send(listData.reviews);
}));


// Error Handling Middlewares
app.all("*",(req,res,next)=>{
    next(new myError(404,"Page not Found"));
});
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Some Error Occure"}=err;
    console.log(message);
    res.render("listings/Error.ejs",{who:"Error",message});
});
app.listen(port,()=>{
    console.log("Ports is Listening");
});