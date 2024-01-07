const myError=require('../utils/myErrors');
const { listingSchema } = require("../schema.js");
const {reviewSchema} =require("../schema.js");

module.exports.isLogin=(req,res,next)=>{
    if(!req.isAuthenticated()){
        console.log(req);
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
