const mongoose = require('mongoose');
const Listing = require('./listingSchema');

let isConnected = false;

async function initialize(connectionString) {
  if (!isConnected) {
    await mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });
    isConnected = true;
    console.log('MongoDB Connected');
  }
}

async function addListing(data) {
  return await Listing.create(data);
}

async function getAllListings(page = 1, perPage = 10, name) {
  let query = name ? { name: new RegExp(name, 'i') } : {};
  return await Listing.find(query)
    .limit(parseInt(perPage))
    .skip((parseInt(page) - 1) * parseInt(perPage));
}

async function getListingById(id) {
  return await Listing.findById(id);
}

async function updateListing(id, data) {
  return await Listing.findByIdAndUpdate(id, data, { new: true });
}

async function deleteListing(id) {
  return await Listing.findByIdAndDelete(id);
}

module.exports = { initialize, addListing, getAllListings, getListingById, updateListing, deleteListing };
