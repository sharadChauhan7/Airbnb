const myError=require('../utils/myErrors');
const { listingSchema } = require("../schema.js");
const {reviewSchema} =require("../schema.js");
const Listing=require('../modal/index.js');
const Review=require('../modal/review.js');

module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","User must be login first");
        return res.redirect('/login');
    }
    next();
}
module.exports.saveRedirecturl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      let msg = result.error.details.map((el) => el.message).join(",");
      throw new myError(400, msg);
    } else {
      next();
    }
};

module.exports.validateReview=(req,res,next)=>{
    let result= reviewSchema.validate(req.body);
    if(result.error){
        let msg=result.error.details.map(el=>el.message).join(",");
        throw new myError(400,msg);
    }
    else{
        next();
    }
}

module.exports.isowner=async(req,res,next)=>{
    let { id } = req.params;
    let List = await Listing.findById(id);
    if(!req.user._id.equals(List.owner)){
        req.flash("error","Only owner can Update the Listing");
        return res.redirect(`/listings/${id}/show`);
    }
    next();
}

module.exports.isReviewAuthor= async (req,res,next)=>{
    let {id,reviewid}=req.params;
    let review=await Review.findById(reviewid).populate('author');
    if(!review.author._id.equals(req.user._id)){
        req.flash('error','Only owner can delete this review');
        return res.redirect(`/listings/${id}/show`);
    }
    next();
}