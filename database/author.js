const mongoose = require("mongoose");

// Creatting a author schema
const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 10,
    },
    books: [String],
});

// Create a author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;