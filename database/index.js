require("dotenv").config();

const { request, response } = require("express");

// Framework
const express = require("express");
const mongoose = require("mongoose");

// exporting database
const database = require("../database");

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

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/ 
booky.get("/", (request, response) => {
  return response.json({books: database.books});
});

/*
Route           /
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/ 
booky.get("/is/:isbn", (request, response) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === request.params.isbn
  );

  if(getSpecificBook.length === 0) {
    return response.json({ error: `No book found for the ISBN of ${request.params.isbn}` });
  }

  return response.json({ book: getSpecificBook });
});

/*
Route           /c
Description     Get list of books based on  category
Access          PUBLIC
Parameter       category
Methods         GET
*/ 
booky.get("/c/:category", (request, response) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(request.params.category)
  );

  if(getSpecificBook.length === 0) {
    return response.json({ error: `No book found for the category of ${request.params.category}` });
  }

  return response.json({ book: getSpecificBook });
});

/*
Route           /l
Description     Get list of books based on languages
Access          PUBLIC
Parameter       language
Methods         GET
*/ 
booky.get("/l/:language", (request, response) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === request.params.language
  );

  if(getSpecificBook.length === 0) {
    return response.json({ error: `No book found for the language of ${request.params.language}` });
  }

  return response.json({ book: getSpecificBook });
});

/*
Route           /book/add
Description     Add new book
Access          PUBLIC
Parameter       NONE
Methods         POST
*/ 
booky.post("/book/add", (request, response) => {
  const { newBook } = request.body;

  database.books.push(newBook);

  return response.json({ books: database.books });
});

// HTTP Client -> helper who helps you make HTTP requests other than GET

/*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/ 
booky.put("/book/update/title/:isbn", (request, response) => {
  database.books.forEach((book) => {
    if(book.ISBN === request.params.isbn) {
      book.title = request.body.newBookTitle;
      return;
    }

    return response.json({ books: database.books });
  });
});

/*
Route           /book/update/author
Description     Update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/ 
booky.put("/book/update/author/:isbn/:authorID", (request, response) => {
  // update books database
  database.books.forEach((book) => {
    if(book.ISBN === request.params.isbn) {
      return book.authors.push(parseInt(request.params.authorID));
    }
  });

  // update author database
  database.authors.forEach((author) => {
    if(author.id === request.params.authorID) {
      return author.books.push(parseInt(request.params.isbn));
    }
  });

  return response.json({ books: database.books, authors: database.authors });
});

/*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/ 
booky.delete("/book/delete/:isbn", (request, response) => {

  const updatedBookDatabase = database.books.filter(
    (book) => book.isbn !== request.params.isbn
  );

  database.books = updatedBookDatabase;
  return response.json({ books: database.books });
});

/*
Route           /book/author/delete
Description     Delete a author from book
Access          PUBLIC
Parameter       isbn, aID
Methods         DELETE
*/ 
booky.delete("/book/author/delete/:isbn/:aID", (request, response) => {
  // update book database
  database.books.forEach((book) => {
    if(book.isbn === request.params.isbn) {
      const newAuthorList = book.authors.filter(
        (author) => author !== parseInt(request.params.aID)
      );
      books.authors = newAuthorList;
      return;
    }
  });

  // update author database
  database.authors.forEach((author) => {
    if(author.id === parseInt(request.params.aID)) {
      const newBookList = author.books.filter(
        (book) => book !== request.params.isbn
      );
      author.books = newBookList;
      return;
    };
  });

  return response.json({
    message: "Author deleted from book",
    books: database.books,
    authors: database.authors,
  });
});

/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/ 
booky.get("/author", (request, response) => {
  return response.json({ authors: database.authors });
});

/*
Route           /author/id
Description     Get specific authors 
Access          PUBLIC
Parameter       aID
Methods         GET
*/ 
booky.get("/author/id/:aID", (request, response) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.id === parseInt(request.params.aID)
  );

  if(getSpecificAuthor.length === 0) {
    return response.json({ error: `No author found for the ID of ${request.params.aID}` });
  }

  return response.json({ book: getSpecificAuthor });
});

/*
Route           /author/book
Description     Get a list of authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/ 
booky.get("/author/book/:isbn", (request, response) => {
  const getSpecificAuthor = database.authors.filter(
    (author) => author.books.includes(request.params.isbn)
  );

  if(getSpecificAuthor.length === 0) {
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
  console.log(request.body);
  const { newAuthor } = request.body;

  database.authors.push(newAuthor);

  return response.json({ authors: database.authors });
});

/*
Route           /author/add
Description     Update author name
Access          PUBLIC
Parameter       aID
Methods         PUT
*/ 
booky.put("/author/update/name/:aID", (request, response) => {
  database.authors.forEach((author) => {
    if(author.id === parseInt(request.params.aID)) {
      author.name = request.body.updatedAuthorName;
      return;
    }

    return response.json({ authors: database.authors });
  });
});

/*
Route           /author/delete
Description     Delete an author
Access          PUBLIC
Parameter       aID
Methods         DELETE
*/ 
booky.delete("/author/delete/:aID", (request, response) => {

  const updatedAuthorDatabase = database.authors.filter(
    (author) => author.id !== request.params.aID
  );

  database.authors = updatedAuthorDatabase;
  return response.json({ authors: database.authors });
});

/*
Route           /pub
Description     Get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/pub", (request, response) => {
  return response.json({ publications: database.publications});
});

/*
Route           /pub/id
Description     Get specific publications based on id
Access          PUBLIC
Parameter       pubID
Methods         GET
*/ 
booky.get("/pub/id/:pubID", (request, response) => {
  const getSpecificPublication = database.publications.filter(
    (publication) => publication.id === parseInt(request.params.pubID)
  );

  if(getSpecificPublication.length === 0) {
    return response.json({ error: `No publication found for the ID of ${request.params.aID}` });
  }

  return response.json({ book: getSpecificPublications });
});

/*
Route           /pub/book
Description     Get a list of publications based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/pub/book/:isbn", (request, response) => {
  const getSpecificPublication = database.publications.filter(
    (publication) => publication.books.includes(request.params.isbn)
  );

  if(getSpecificPublication.length === 0) {
    return response.json({ error: `No publication found for the ISBN of ${request.params.isbn}` });
  }

  return response.json({ authors: getSpecificPublications });
});

/*
Route           /pub/add
Description     Add new publication
Access          PUBLIC
Parameter       NONE
Methods         POST
*/ 
booky.post("/pub/add", (request, response) => {
  const { newPublication } = request.body;

  database.publications.push(newPublication);

  return response.json({ publications: database.publications });
});

/*
Route           /pub/update/name
Description     Update publication name based on id
Access          PUBLIC
Parameter       pubID
Methods         PUT
*/ 
booky.put("/pub/update/name/:pubID", (request, response) => {
  database.publications.forEach((publication) => {
    if(publication.id === parseInt(request.params.pubID)) {
      publication.name = request.body.updatedPublicationName;
      return;
    }

    return response.json({ books: database.publications });
  });
});

/*
Route           /pub/update/book
Description     Update/Add books to publications
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/ 
booky.put("/pub/update/book/:isbn", (request, response) => {
  // update the publications database
  database.publications.forEach((publication) => {
    if(publication.id === request.body.pubID) {
      return publication.books.push(request.params.isbn);
    }
  });

  // update the books database
  database.books.forEach((book) => {
    if(book.isbn === request.params.isbn) {
      return book.publications.push(request.body.pubID);
    }
  });

  return response.json({
    books: database.books,
    publications: database.publications,
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
booky.delete("/pub/delete/:pubID", (request, response) => {

  const updatedPublicationDatabase = database.publications.filter(
    (publication) => publication.id !== request.params.pubID
  );

  database.publications = updatedPublicationDatabase;
  return response.json({ publications: database.publications });
});

/*
Route           /pub/book/delete
Description     Delete a book in a publication
Access          PUBLIC
Parameter       pubID, isbn
Methods         DELETE
*/ 
booky.delete("/pub/book/delete/:isbn/:pubID", (request, response) => {
  // update book database
  database.publications.forEach((publication) => {
    if(publication.id === request.params.pubID) {
      const newBookList = publication.books.filter(
        (book) => book !== parseInt(request.params.isbn)
      );
      publication.books = newBookList;
      return;
    }
  });

  // update author database
  database.books.forEach((book) => {
    if(book.isbn === parseInt(request.params.isbn)) {
      const newPublicationList = book.publications.filter(
        (publication) => publication !== request.params.pubID
      );
      book.publications = newPublicationList;
      return;
    };
  });

  return response.json({
    message: "Book deleted from publication",
    publications: database.publications,
    books: database.books,
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