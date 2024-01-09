const Listing = require("../modal/index");
const Review=require("../modal/review");

module.exports.postReview=async(req,res,next)=>{
    let {id}=req.params;
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    let listData= await Listing.findById(id);
    listData.reviews.push(newReview);
    
    await newReview.save();
    await listData.save();
    req.flash("success","Review Added");
    res.redirect(`/listings/${id}/show`);
}
module.exports.destroyReview=async(req,res)=>{
    let {id,reviewid}=req.params;
    await Review.findByIdAndDelete(reviewid);
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}});
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}/show`);
}
