require("dotenv").config();

const { request, response } = require("express");

// Framework
const express = require("express");
const mongoose = require("mongoose");

// exporting database
const database = require("./database/index");

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication")

// Initializing microservices routes
const Books = require("./API/Book"); //JavaScript automatically opens index file

// Initialization of API
const booky = express();

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


/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/ 
booky.get("/author", async (request, response) => {
  const getAllAuthors = await AuthorModel.find();
  return response.json(getAllAuthors);
});

/*
Route           /author/id
Description     Get specific authors 
Access          PUBLIC
Parameter       aID
Methods         GET
*/ 
booky.get("/author/id/:aID", async (request, response) => {
  const getSpecificAuthor = await AuthorModel.findOne({id: request.params.aID});

  if(!getSpecificAuthor) {
    return response.json({ error: `No author found for the ID of ${request.params.aID}` });
  }

  return response.json({ authors: getSpecificAuthor });
});

/*
Route           /author/book
Description     Get a list of authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/ 
booky.get("/author/book/:isbn", async (request, response) => {
  const getSpecificAuthor = await AuthorModel.findOne({ISBN: request.params.isbn});

  if(!getSpecificAuthor) {
    return response.json({ error: `No author found for the ISBN of ${request.params.isbn}` });
  }

  return response.json({ authors: getSpecificAuthor });
});

/*
Route           /author/add
Description     Add new author
Access          PUBLIC
Parameter       NONE
Methods         POST
*/ 
booky.post("/author/add", (request, response) => {
  const { newAuthor } = request.body;

  AuthorModel.create(newAuthor); 

  return response.json({ message: "author was added" });
});

/*
Route           /author/add
Description     Update author name
Access          PUBLIC
Parameter       aID
Methods         PUT
*/ 
booky.put("/author/update/name/:aID", async (request, response) => {
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: request.params.aID,
    },
    {
      title: request.body.newAuthorName,
    },
    {
      new: true,
    }
  );
    
  return response.json(updatedAuthor);
});

/*
Route           /author/delete
Description     Delete an author
Access          PUBLIC
Parameter       aID
Methods         DELETE
*/ 
booky.delete("/author/delete/:aID", async (request, response) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(request.params.aID),
  });
 
  return response.json({ authors: updatedAuthorDatabase });
});

/*
Route           /pub
Description     Get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/pub", async (request, response) => {
  const getAllPublications = await PublicationModel.find();
  return response.json(getAllPublications);
});

/*
Route           /pub/id
Description     Get specific publications based on id
Access          PUBLIC
Parameter       pubID
Methods         GET
*/ 
booky.get("/pub/id/:pubID", async (request, response) => {
  const getSpecificPublication = await PublicationModel.findOne({id: request.params.pubID});

  if(!getSpecificPublication) {
    return response.json({ error: `No publication found for the ID of ${request.params.aID}` });
  }

  return response.json({ publication: getSpecificPublications });
});

/*
Route           /pub/book
Description     Get a list of publications based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/pub/book/:isbn", async (request, response) => {
  const getSpecificPublication = await BookModel.findOne({ISBN: request.params.isbn});

  if(!getSpecificPublication) {
    return response.json({ error: `No publication found for the ISBN of ${request.params.isbn}` });
  }

  return response.json({ publications: getSpecificPublication });
});

/*
Route           /pub/add
Description     Add new publication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/ 
booky.post("/pub/add", async (request, response) => {
  const { newPublication } = request.body;

  PublicationModel.create(newPublication); 

  return response.json({ message: "publication was added" });
});

/*
Route           /pub/update/name
Description     Update publication name based on id
Access          PUBLIC
Parameter       pubID
Methods         PUT
*/ 
booky.put("/pub/update/name/:pubID", async (request, response) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: request.params.pubID,
    },
    {
      title: request.body.newPublicationName,
    },
    {
      new: true,
    }
  );

  return response.json(updatedPublication);
});

/*
Route           /pub/update/book
Description     Update/Add books to publications
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/ 
booky.put("/pub/update/book/:isbn", async (request, response) => {
  // update the publications database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: request.body.newPublication,
    },
    {
      $addToSet: {
        books: request.params.isbn,
      }
    },
    {
      new: true,
    }
  );

  // update the books database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: request.params.isbn,
    },
    {
      $addToSet: {
        authors: request.body.newPublication,
      }
    },
    {
      new: true,
    }
  );

  return response.json({
    books: updatedBook,
    publications: updatedPublication,
    message: "Successfully updated publication",
  });
});

/*
Route           /pub/delete
Description     Delete a publication
Access          PUBLIC
Parameter       pubID
Methods         DELETE
*/ 
booky.delete("/pub/delete/:pubID", async (request, response) => {
  const updatedPublicationDatabase = await PublicationModel.findOneAndDelete({
    id: parseInt(request.params.pubID),
  });

  return response.json({ publications: updatedPublicationDatabase });
});

/*
Route           /pub/book/delete
Description     Delete a book in a publication
Access          PUBLIC
Parameter       pubID, isbn
Methods         DELETE
*/ 
booky.delete("/pub/book/delete/:isbn/:pubID", async (request, response) => {
  // update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: request.params.isbn,
    },
    {
      $pull: {
        publications: parseInt(request.params.pubID),
      }
    },
    {
      new: true,
    }
  );

  // update author database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(request.params.pubID),
    },
    {
      $pull: {
        books: request.params.isbn,
      }
    },
    {
      new: true,
    }
  );


  return response.json({
    message: "Book deleted from publication",
    publications: updatedPublication,
    books: updatedBook,
  });
});

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