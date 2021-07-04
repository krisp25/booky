require("dotenv").config();

// Framework
const express = require("express");
const mongoose = require("mongoose");

// Initializing microservices routes
const Books = require("./API/Book"); //JavaScript automatically opens index file
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Initialization of API
const booky = express();

// Configurations
booky.use(express.json());

// Establish database connection
mongoose.connect(
  process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  }
).then(() => console.log("Connection established!"));

// Initializing microservices
booky.use("/book", Books);
booky.use("/author", Authors);
booky.use("/pub", Publications);

booky.listen(3000, () => console.log("Hey Server is running!!"));

// Mongoose
// Talk to mongodb in a language mongodb understands -> *******
// Talk to us in a language we understand -> JavaScript

// Why schema?
// mongoDB is schemaless but mongoose isn't schemaless
// mongoose helps you with validation and relationship (SQL usually has relation) with other data
// mongoose is limited to only mongoDB

// mongoose model
// model -> document model of mongoDB
// Exampe -> Database (collections) - booky
//           Document - books, authors, publications