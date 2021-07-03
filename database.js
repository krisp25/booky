let books = [
  {
    ISBN: "12345Book",
    title: "Getting started with MERN",
    pubDate: "2021-07-07",
    language: "en",
    numPage: 250,
    authors: [1, 2],
    publications: [1],
    category: ["tech", "programming", "education", "thriller"],
  },
];

let authors = [
  {
    id: 1,
    name: "Krispy",
    books: ["12345Book"],
  },
  {
    id: 2,
    name: "Elon Musk",
    books: ["12345Book"],
  }
];

let publications = [
  {
    id: 1,
    name: "writex",
    books: ["12345Book"],
  },
  {
    id: 2,
    name: "trouva",
    books: [],
  }
];

module.exports = { books, authors, publications };