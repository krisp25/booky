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

// JSON Example request body of book

// "newBook": {
//   "ISBN": "12345Two",
//   "title": "Getting Started with CSS",
//   "pubDate": "2021-25-05",
//   "language": "en",
//   "numPage": 369,
//   "authors": [
//       1,
//       2
//   ],
//   "publications": [
//       1
//   ],
//   "category": [
//       "tech",
//       "programming",
//       "education"
//   ]
// }

// JSON Example request body of author

// "newAuthor": {
//   "id": 1,
//   "name": "Krispy",
//   "books": ["12345Book"],
// }

// JSON Example request body of publication

// "newPublication": {
//   "id": 2,
//   "name": "trouva",
//   "books": [],
// }