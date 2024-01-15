const Listing = require("../modal/index");
const myError = require("../utils/myErrors");
const mbxClient = require('@mapbox/mapbox-sdk');
const mbgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
require('dotenv').config();

const mapToken=process.env.MAP_TOKEN;

const baseClient = mbxClient({ accessToken: mapToken });
const geocodingClient= mbgeocoding(baseClient);

module.exports.home=async (req, res) => {
    let Listings = await Listing.find();
    res.render("listings/index.ejs", { Listings, who: "Home" });
};

module.exports.showListings=async (req, res) =>{
    let { id } = req.params;
    let listData = await Listing.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('owner');
    if (!listData) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { listData, who: "View"});
    }
};
module.exports.listingForm=(req, res) => {
    res.render("listings/form.ejs", { who: "Create" });
};

module.exports.postListing=async (req, res) => {
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing = new Listing(req.body.listing);

    // Map
    let match = await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    }).send()

    // Adding owner
    newListing.image={url,filename}; 
    newListing.owner=req.user._id;
    // Adding geometry

    newListing.geometry=match.body.features[0].geometry;

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
};

module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id);
    if (!List) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    } else {
      let originalImg = List.image.url;
      // originalImg = originalImg.replace("/upload","/upload/c_fit,w_250");
      res.render("listings/edit.ejs", { List, who: "Edit" ,originalImg});
    }
};

module.exports.updateListing=async (req, res, next) => {
    let { id } = req.params;
    // Saving Image
        // Map
        let match = await geocodingClient.forwardGeocode({
          query: req.body.listing.location,
          limit: 1
        }).send()
        req.body.listing.geometry=match.body.features[0].geometry;
    
    if(req.file){
      let url=req.file.path;
      let filename=req.file.filename;
      req.body.listing.image={url,filename};
    }
    // Adding geometry
    await Listing.findByIdAndUpdate(id, req.body.listing, { runValidators: true });
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}/show`);
};

module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let listData = await Listing.findByIdAndDelete(id);
    if (!listData) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    } else {
      req.flash("success", "Listing Deleted");
      res.redirect("/listings");
    }
}
module.exports.filter=async(req,res)=>{
  let {name="none"}=req.query;
  name =name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  let Listings = await Listing.find({category:{$in:[name]}});
  if(Listings.length===0){
    req.flash("error","No Listing Found");
    return res.redirect('/listings');
  }
  res.render("listings/index.ejs", { Listings, who: "Home" });
}



