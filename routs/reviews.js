const express= require("express");
const router = express.Router({mergeParams:true});

const asyncWrap=require("../utils/asyncWrap");
const Review=require("../modal/review");
const myError = require("../utils/myErrors");

const Listing= require("../modal/index");

const {reviewSchema} =require("../schema.js");

// Middleware
const validateReview=(req,res,next)=>{
    let result= reviewSchema.validate(req.body);
    if(result.error){
        let msg=result.error.details.map(el=>el.message).join(",");
        throw new myError(400,msg);
    }
    else{
        next();
    }
}



//Review Route
router.post("/",validateReview,asyncWrap(async(req,res,next)=>{
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