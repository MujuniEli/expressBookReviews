const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(username && password) {
    if(isValid(username)) {
      users.push({username: username, password: password});
      return res.status(200).json({message: "User registered successfully"});
    } else {
      return res.status(400).json({message: "Username already exists"});
    }
} else {
    return res.status(400).json({message: "Unable to register Username or password not provided"});
}
  
});

// Get the book list available in the shop using Promises
public_users.get('/books', function (req, res) {
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  })
  .then((books) => {
    res.status(200).json(books);
  })
  .catch((error) => {
    res.status(404).json({ message: error });
  });
});

// // Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books, null, 2));
  
// });

// Get book details based on ISBN using async-await with axios
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`http://localhost:5000/books/${isbn}`);
    const book = response.data;

    if (book) {
      return res.status(200).json(book);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "ISBN N0. doesn't match any of the books in our database", error: error.message });
  }
});

// // Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   const isbn = req.params.isbn;
//   let book = null;

//   for(let key in books) {
//     if(books[key].isbn === isbn) {
//       book = books[key];
//       break;
//     }
// }

//   if(books[isbn]) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({message: "Book not found"});
//   }
//   // return res.status(300).json({message: "Yet to be implemented"});
//  });
  
// Get book details based on author using async-await with axios
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(`http://localhost:5000/books/author/${author}`);
    const booksByAuthor = response.data;

    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    } else {
      return res.status(404).json({ message: "Author not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Book not found!!", error: error.message });
  }
});

// // Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   //Write your code here
//   const author = req.params.author;
//   let result = [];
//   for(let i in books) {
//     if(books[i].author === author) {
//       result.push(books[i]);
//     }
//   }
//   if(result.length > 0) {
//     return res.status(200).json(result);
//   } else {
//     return res.status(404).json({message: "Author not found"});
//   }
  
// });

// Get book details based on title using async-await with axios
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(`http://localhost:5000/books/title/${title}`);
    const booksByTitle = response.data;

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    } else {
      return res.status(404).json({ message: "Title not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Book not found", error: error.message });
  }
});

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Write your code here
//   const title = req.params.title;
//   let result = [];
//   for(let i in books) {
//     if(books[i].title === title) {
//       result.push(books[i]);
//     }
//   }
//   if(result.length > 0) {
//     return res.status(200).json(result);
//   } else {
//     return res.status(404).json({message: "Title not found"});
//   }
  
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = null;

  for(let key in books) {
    if(books[key].isbn === isbn) {
      book = books[key];
      break;
    }
  }

  if(book) {
    if(book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({message: "No reviews found"});
    }
  } else {
    return res.status(404).json({message: "Book & Review not found"});
  }
 
  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
