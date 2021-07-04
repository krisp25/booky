// Prefix -> /book

// Initializing router
// Router is used to implement micro services
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");

/*
Route           /
Description     Get all books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/ 
Router.get("/", async (request, response) => {
    const getAllBooks = await BookModel.find();
    return response.json(getAllBooks);
});

/*
Route           /
Description     Get specific books based on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/ 
Router.get("/is/:isbn", async (request, response) => {

    const getSpecificBook = await BookModel.findOne({ISBN: request.params.isbn});
  
    // null -> false
    // mongoDB returns null if no similar data found
    if(!getSpecificBook) {
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
Router.get("/c/:category", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({category: request.params.category});
  
    if(!getSpecificBook) {
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
Router.get("/l/:language", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({language: request.params.language});
  
    if(!getSpecificBook.length) {
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
Router.post("/add", async (request, response) => {
    try {
      const { newBook } = request.body;
  
      await BookModel.create(newBook); 
    
      return response.json({ message: "book was added" });
    } catch (error) {
      return response.json({ error: error.message });
    }
});
  
// HTTP Client -> helper who helps you make HTTP requests other than GET
  
/*
Route           /book/update/title
Description     Update book title
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/ 
Router.put("/update/title/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: request.params.isbn,
      },
      {
        title: request.body.newBookTitle,
      },
      {
        new: true, //to get updated data
      }
    );
  
    return response.json(updatedBook);
   
});
  
/*
Route           /book/update/author
Description     Update/add new author for a book
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/ 
Router.put("/update/author/:isbn", async (request, response) => {
    // update books database
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: request.params.isbn,
      },
      {
        $addToSet: {
          authors: request.body.newAuthor,
        }
      },
      {
        new: true,
      }
    );
  
    // update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: request.body.newAuthor,
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
  
    return response.json({ book: updatedBook, author: updatedAuthor });
});
  
/*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/ 
Router.delete("/delete/:isbn", async (request, response) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete({
      ISBN: request.params.isbn,
    });
    
    return response.json({ books: updatedBookDatabase });
});
  
/*
Route           /book/author/delete
Description     Delete a author from book
Access          PUBLIC
Parameter       isbn, aID
Methods         DELETE
*/ 
Router.delete("/author/delete/:isbn/:aID", async (request, response) => {
    // update book database
    const updatedBook = await BookModel.findOneAndUpdate(
      {
        ISBN: request.params.isbn,
      },
      {
        $pull: {
          authors: parseInt(request.params.aID),
        }
      },
      {
        new: true,
      }
    );
  
    // update author database
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
      {
        id: parseInt(request.params.aID),
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
      message: "Author deleted from book",
      book: updatedBook,
      author: updatedAuthor,
    });
});
  
module.exports = Router;