const express= require("express");
const router = express.Router({mergeParams:true});

const asyncWrap=require("../utils/asyncWrap");

const Listings = require("../controller/review.js");

const {isLogin,validateReview,isReviewAuthor}=require("../middleware/middleware.js");
const { destroyReview } = require("../controller/review.js");

// Middleware


//Review Route
router.post("/",validateReview,isLogin,asyncWrap(Listings.postReview));

// Delete Review
router.delete("/:reviewid",isLogin,isReviewAuthor,asyncWrap(Listings.destroyReview));

module.exports=router