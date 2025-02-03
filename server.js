/********************************************************************************
 *  WEB422 – Assignment 1
 *  
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *  
 *  Name: MD ARAFAT KOYES
 *  Student ID: 133682229
 ********************************************************************************/

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./modules/listingsDB");

const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Database Connection
db.initialize(process.env.MONGODB_CONN_STRING)
  .then(() => console.log("Database Connected!"))
  .catch(err => console.log(err));

// Default Route
app.get("/", (req, res) => {
  res.send("Welcome to the Listings API!");
});

// ➤ CREATE: Add a new listing
app.post("/api/listings", async (req, res) => {
  try {
    const newListing = await db.addListing(req.body);
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ READ: Get paginated listings (optional filter by name)
app.get("/api/listings", async (req, res) => {
  const { page = 1, perPage = 10, name } = req.query;
  try {
    const listings = await db.getListings(Number(page), Number(perPage), name);
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ READ: Get a single listing by ID
app.get("/api/listings/:id", async (req, res) => {
  try {
    const listing = await db.getListingById(req.params.id);
    if (!listing) return res.status(404).send("Listing not found.");
    res.json(listing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ UPDATE: Modify an existing listing by ID
app.put("/api/listings/:id", async (req, res) => {
  try {
    const updatedListing = await db.updateListing(req.params.id, req.body);
    res.json(updatedListing);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ DELETE: Remove a listing by ID
app.delete("/api/listings/:id", async (req, res) => {
  try {
    await db.deleteListing(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(HTTP_PORT, () => {
  console.log(`Server listening on port ${HTTP_PORT}`);
});
