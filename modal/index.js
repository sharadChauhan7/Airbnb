const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");
let url = 'mongodb://127.0.0.1:27017/airbnb';

main().then((res) => {
    console.log("Connection is up");
})
    .catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect(url);
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
        type: String,
        set: (v) => v === "" ? v = "https://plus.unsplash.com/premium_photo-1700124504129-02393b281f06?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D" : v,
        default: "https://plus.unsplash.com/premium_photo-1700124504129-02393b281f06?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyNXx8fGVufDB8fHx8fA%3D%3D",
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
    }
    ]
});
// Post Middleware for deleting Reviews
PropertySchema.post("findOneAndDelete",async(listing)=>{
        let result =await Review.deleteMany({_id:{$in:listing.reviews}});
});

const Listing = mongoose.model("Listing", PropertySchema);
module.exports = Listing;

