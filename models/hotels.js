const mongoose = require("../db");

const hotelSchema = new mongoose.Schema({
    name: String,
    rating: Number,
    reviews: Number,
    description: String,
    price: Number,
    discount: Number,
    region: String,
    area: String,
    services: [String],
    images: [String],
    location: {
        latitude: Number,
        longitude: Number
    }
});

const Hotel = mongoose.model("Hotel", hotelSchema);
module.exports = Hotel;
