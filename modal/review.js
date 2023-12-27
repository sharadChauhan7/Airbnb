const mongoose = require("mongoose");
const Listing=require("./index");
const Schema = mongoose.Schema;
const reviewSchema = Schema({
    comment:{
        type:String,
        required: true,
    },
    rating:{
        type:Number,
        min:1,
        max:5,
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
    }
);

// Pre Middleware


const Review= mongoose.model("review",reviewSchema);

module.exports=Review;