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

// Filter Route
router.get('/filter',asyncWrap(Listing.filter));


router
  .route('/')
  // Home
  .get( asyncWrap(Listing.home))
  // Post listing
  .post(upload.single('listing[image]'),validateListing,asyncWrap(Listing.postListing));


// Show Route
router
  .route("/:id/show")
  .get(asyncWrap(Listing.showListings))


// New Route
router
.route("/new")
.get(isLogin, Listing.listingForm);


// Edit Route
router
  .route("/:id")
  .get(isLogin, isowner, asyncWrap(Listing.editListing))
  .put(
    isLogin,
    isowner,
    upload.single('listing[image]'),
    validateListing,
    asyncWrap(Listing.updateListing)
  )
  .delete(isLogin, isowner, asyncWrap(Listing.destroyListing))


module.exports = router;
