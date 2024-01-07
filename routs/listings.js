const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../modal/index");
const asyncWrap = require("../utils/asyncWrap");
const myError = require("../utils/myErrors");
const { isLogin ,validateListing } = require("../middleware/middleware");

// Listing  Route

router.get(
  "/",
  asyncWrap(async (req, res) => {
    let Listings = await Listing.find();
    res.render("listings/index.ejs", { Listings, who: "Home" });
  })
);

// Show Route
router.get(
  "/:id/show",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listData = await Listing.findById(id).populate("reviews");
    if (!listData) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    } else {
      res.render("listings/show.ejs", { listData, who: "View" });
    }
  })
);

// New Route
router.get("/new",isLogin, (req, res) => {
  res.render("listings/form.ejs", { who: "Create" });
});

// Post Route
router.post(
  "/",
  validateListing,
  asyncWrap(async (req, res) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

// Edit Route
router.get(
  "/:id/edit",
  isLogin,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let List = await Listing.findById(id);
    if (!List) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    } else {
      res.render("listings/edit.ejs", { List, who: "Edit" });
    }
  })
);

// Update Route
router.put(
  "/:id/edit",
  validateListing,
  asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, req.body, { runValidators: true });
    req.flash("success", "Listing Updated");
    res.redirect("/listings");
  })
);
// Delete Route
router.delete(
  "/:id/delete",
  isLogin,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listData = await Listing.findByIdAndDelete(id);
    if (!listData) {
      req.flash("error", "Listing doesn't exist");
      res.redirect("/listings");
    } else {
      req.flash("success", "Listing Deleted");
      res.redirect("/listings");
    }
  })
);

module.exports = router;
