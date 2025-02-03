const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  name: String,
  summary: String,
  price: Number,
  address: {
    street: String,
    city: String,
    country: String
  },
  bedrooms: Number,
  bathrooms: Number
}, { collection: 'listingsAndReviews' });

module.exports = mongoose.model('Listing', listingSchema);
