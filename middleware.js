const Listing = require("./models/listing.js");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        console.log(req.session);
        req.flash("error", "You must be logged in to view this page");
        return res.redirect("/login")
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner[0].equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to edit or delete");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You don't have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
}

