const express = require("express");
const router = express.Router({ mergeParams: true });

const asyncWrap = require("../utils/asyncWrap");
const { isLogin, validateListing, isowner } = require("../middleware/middleware");
const { showListings, listingForm } = require("../controller/listing");
const Listing=require('../controller/listing');
// Listing  Route

// multer
const multer  = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({storage});

router.get("/", asyncWrap(Listing.home));

// Show Route
router.get("/:id/show", asyncWrap(Listing.showListings));

// New Route
router.get("/new", isLogin, Listing.listingForm);

// Post Route
router.post("/",upload.single('listing[image]'),validateListing,asyncWrap(Listing.postListing));

// Edit Route
router.get("/:id/edit", isLogin, isowner, asyncWrap(Listing.editListing));

// Update Route
router.put(
  "/:id/edit",
  isLogin,
  isowner,
  upload.single('listing[image]'),
  validateListing,
  asyncWrap(Listing.updateListing)
);
// Delete Route
router.delete("/:id/delete", isLogin, isowner, asyncWrap(Listing.destroyListing));

module.exports = router;
