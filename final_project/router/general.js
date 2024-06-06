const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books,null,4))

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
    const book = books[isbn];
    if(book){
        return res.send(book);
    }else{
       return res.send("Book not found");
    }
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let booksFound = [];
    
    if (author) {
        for (let key in books) {
            const book = books[key];
            if (book.author === author) {
                booksFound.push(book);
            }
        }

        if (booksFound.length > 0) {
            return res.json(booksFound);
        } else {
            return res.status(404).json({ message: "No books for the author found" });
        }
    }
    
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksFound = [];
    
    if (title) {
        for (let key in books) {
            const book = books[key];
            if (book.title === title) {
                booksFound.push(book);
            }
        }

        if (booksFound.length > 0) {
            return res.json(booksFound);
        } else {
            return res.status(404).json({ message: "No books for the author found" });
        }
    }
    
    return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
