const joi=require("joi");

// Schema Validation

module.exports.schema=joi.object({
    listing : joi.object({
        title: joi.string()
        .required()
        .max(40),

        discription: joi.string()
        .required()
        .max(200),

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