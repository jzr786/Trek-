const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    // console.log(listing);
    // console.log(newReview);
    listing.review.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review created");

    res.redirect(`/listings/${listing._id}`)

}

module.exports.deleteReview = async (req, res, next) => {
    let { id, reviewId } = req.params;
    // console.log(reviewId);

    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } })
    await Review.findByIdAndDelete(reviewId);
    req.flash("deleted", "Review deleted");
    res.redirect(`/listings/${id}`);
}