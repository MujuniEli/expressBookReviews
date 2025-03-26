const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [{ username: 'testuser', password: 'testpassword' },];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let samenameusers = users.filter(user => user.username === username);
  return samenameusers.length === 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validUsers = users.filter(user => user.username === username && user.password === password);
  return validUsers.length > 0;
};

const app = express();

app.use(session({secret:"finger",resave: false, saveUninitialized: true}));

app.use(express.json());


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.status(400).json({message: "Username or password not provided"});
}

  if(authenticatedUser(username, password)) {
      let token = jwt.sign({data: password}, "access", {expiresIn: "1h"});
      req.session.authorization = {accessToken: token};
      return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(403).json({message: "Invalid Login Details. Check username and password"});
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.reviews;
  const isbn = req.params.isbn;
  const username = req.body.username;
  
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const user = req.session.username || username;
  if (!user) {
    return res.status(403).json({ message: "Username not provided or user not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[user] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

// delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.body.username;
  
  if (!req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const user = req.session.username || username;
  if (!user) {
    return res.status(403).json({ message: "Username not provided or user not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  delete books[isbn].reviews[user];

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
