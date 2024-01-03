const joi=require("joi");

// Schema Validation

module.exports.listingSchema=joi.object({
    listing : joi.object({
        title: joi.string()
        .required()
        .max(40),

        description: joi.string()
        .required()
        .max(400),

        country: joi.string()
        .required(),

        location: joi.string()
        .required(),

        price: joi.number()
        .required()
        .min(0),

        image :joi.string()
        .allow("",null)
    }).required()
})

module.exports.reviewSchema=joi.object({
    review: joi.object({
        comment: joi.string()
        .required()
        .max(400),

        rating: joi.number()
        .required()
        .min(1)
        .max(5)
    }).required()
}).required();