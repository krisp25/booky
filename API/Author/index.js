// Prefix -> /author

// Initializing router
// Router is used to implement micro services
const Router = require("express").Router();

// Database Models
const AuthorModel = require("../../database/author");

/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/ 
Router.get("/", async (request, response) => {
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
Router.get("/id/:aID", async (request, response) => {
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
Router.get("/book/:isbn", async (request, response) => {
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
Router.post("/add", (request, response) => {
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
Router.put("/update/name/:aID", async (request, response) => {
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
Router.delete("/delete/:aID", async (request, response) => {
  const updatedAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: parseInt(request.params.aID),
  });
 
  return response.json({ authors: updatedAuthorDatabase });
});

module.exports = Router;
