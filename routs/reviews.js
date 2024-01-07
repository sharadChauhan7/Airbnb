const express= require("express");
const router = express.Router({mergeParams:true});

const asyncWrap=require("../utils/asyncWrap");
const Review=require("../modal/review");
const myError = require("../utils/myErrors");

const Listing= require("../modal/index");
const {isLogin,validateReview}=require("../middleware/middleware.js");

// Middleware


//Review Route
router.post("/",validateReview,isLogin,asyncWrap(async(req,res,next)=>{
    let {id}=req.params;
    let newReview=new Review(req.body.review);
    let listData= await Listing.findById(id);
    listData.reviews.push(newReview);
    
    await newReview.save();
    await listData.save();
    req.flash("success","Review Added");
    res.redirect(`/listings/${id}/show`);
}));

// Delete Review
router.delete("/:reviewid",asyncWrap(async(req,res)=>{
    let {id,reviewid}=req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}/show`)
}));

module.exports=router