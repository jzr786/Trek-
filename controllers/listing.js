const Listing = require("../models/listing.js");
const mbxGeoCoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN
const geocodingClient = mbxGeoCoding({ accessToken: mapToken });


module.exports.index = async (req, res, next) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    // console.log(req.user);

    const listing = await Listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }
    // console.log(listing);

    res.render("listings/show.ejs", { listing })
}

module.exports.createListing = async (req, res) => {

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
        .send()



    let url = req.file.path;
    let filename = req.file.filename;
    // console.log(filename, "...", url);
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    
    req.flash("success", "New Listing created");
    res.redirect("/listings")
}

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing doesn't exist");
        res.redirect("/listings")
    }

    res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { runValidators: true }, { new: true });

    if (typeof req.file !== 'undefined') {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("deleted", "Listing deleted");
    res.redirect("/listings");
}
