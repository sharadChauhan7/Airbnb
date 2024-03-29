const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
require('dotenv').config();
const MongoUrl=process.env.MONGO_URL;

main().then((res) => {
    console.log("Connection is up");
})
    .catch((err) => {
        
        console.log(err);
    })

async function main() {
     mongoose.connect(MongoUrl);
};

const PropertySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        url: String,
        filename: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true,
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    country: {
        type: String,
        required: true,
        default: "India",
    },
    amenities: {
        type: [String],
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"user"
    },
    category:[{
        type:String,
        enum:["Rooms","Lake","Beach","Trending","Mountains","Pool","Camping","City"],
    }]
});
// Post Middleware for deleting Reviews
PropertySchema.post("findOneAndDelete",async(listing)=>{
        let result =await Review.deleteMany({_id:{$in:listing.reviews}});
});

const Listing = mongoose.model("Listing", PropertySchema);
module.exports = Listing;

