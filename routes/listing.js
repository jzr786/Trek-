const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
// const upload = multer({ dest: 'uploads/' })........this uploads the file to uploads folder locally
const upload = multer({ storage });    /*.........this uploads file to cloudinary storage.....*/


const listingController = require("../controllers/listing.js")

const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg)
    }
    else {
        next();
    }
}

// Index and Create route together with router.route

router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));


//New route
router.get("/new", isLoggedIn, listingController.renderNewForm);

// Show route, update route and delete route altogether

router.route("/:id")
    .get(isLoggedIn, wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


//Index route

// router.get("/", wrapAsync(listingController.index));


//Show route
// router.get("/:id", isLoggedIn, wrapAsync(listingController.showListing));

//Create route
// router.post("/", validateListing, isLoggedIn, wrapAsync(listingController.createListing));


//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


module.exports = router;