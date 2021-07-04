const mongoose = require("mongoose");

// Creatting a publication schema
const PublicationSchema = mongoose.Schema({
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

// Create a publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;