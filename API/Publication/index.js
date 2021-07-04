// Prefix -> /pub

// Initializing router
// Router is used to implement micro services
const Router = require("express").Router();

// Database Models
const PublicationModel = require("../../database/publication");

/*
Route           /pub
Description     Get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
Router.get("/", async (request, response) => {
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
Router.get("/id/:pubID", async (request, response) => {
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
Router.get("/book/:isbn", async (request, response) => {
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
Router.post("/add", async (request, response) => {
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
Router.put("/update/name/:pubID", async (request, response) => {
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
Router.put("/update/book/:isbn", async (request, response) => {
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
Router.delete("/delete/:pubID", async (request, response) => {
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
Router.delete("/book/delete/:isbn/:pubID", async (request, response) => {
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

module.exports = Router;