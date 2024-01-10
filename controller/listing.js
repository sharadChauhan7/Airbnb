const Listing = require("../modal/index");
const myError = require("../utils/myErrors");

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
    newListing.image={url,filename}; 
    newListing.owner=req.user._id;
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
      originalImg = originalImg.replace("/upload","/upload/c_fit,w_250");
      res.render("listings/edit.ejs", { List, who: "Edit" ,originalImg});
    }
};

module.exports.updateListing=async (req, res, next) => {
    let { id } = req.params;
    // Saving Image
    let url=req.file.path;
    let filename=req.file.filename;
    req.body.listing.image={url,filename};

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



