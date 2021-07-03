const mongoose = require("mongoose");

// Creatting a book schema
const BookSchema = mongoose.Schema({
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    publications: [Number],
    category: [String],
});

// Create a book model
const BookModel = mongoose.model(BookSchema);

module.exports = BookModel;