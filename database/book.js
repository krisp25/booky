const mongoose = require("mongoose");

// Creatting a book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
    }, //required validation
    title: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 40,
    },
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    publications: [Number],
    category: [String],
});

// Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;