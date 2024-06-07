const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require('axios');
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Please provide a valid username and password"});
});



public_users.get('/', function (req, res) {
    getBooks()
        .then(booksData => {
            res.send(JSON.stringify(booksData, null, 4));
        })
        .catch(error => {
            console.error(error);
            res.status(500).send("Internal Server Error");
        });
});

function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books); // Resolve with the list of books
        }, 1000); // Simulate a delay of 1 second
    });
}




// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn){
    getBookDetailsByIsbn(isbn).then(bookDetails =>{
             res.send(bookDetails);
        }).catch(error =>{
            console.error(error);
            res.status(500).json({ message: "Internal Server Error" });

        })
       
   
  } else{
     res.send("ISBN is wrong");
  }
 });
  function getBookDetailsByIsbn(isbn){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve(books[isbn])
        },1000)
    });
  }
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    if (!author) return res.status(403).json({ message: "Enter a valid author name" });

    getBookDetailsByAuthor(author).then(booksFound=>{
        if (booksFound.length > 0) {
             res.json(booksFound);
        } else {
             res.status(404).json({ message: "No books for the author found" });
        }
    }).catch(error=>{
        res.status(500).json({ message: "Internal Server Error" });
    });

    
   
    
});
function getBookDetailsByAuthor(author){
    return new Promise ((resolve,reject)=>{
        let booksFound = [];
        for (let key in books) {
            const book = books[key];
            if (book.author === author) {
                booksFound.push(book);
            }
        }
        resolve(booksFound);
    })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    
    if (!title) return res.status(403).json({ message: "Enter a valid title" });
    getBooksByTitle(title).then(booksFound =>{
        if (booksFound.length > 0) {
             res.json(booksFound);
        } else {
             res.status(404).json({ message: "No books for this title" });
        }
    }).catch(error=>{
        res.status(500).json({ message: "Internal Server Error" });
    })

  
    
    
});

function getBooksByTitle(title){
    return new Promise((resolve,reject)=>{
        let booksFound = [];
        for (let key in books) {
            const book = books[key];
            if (book.title === title) {
                booksFound.push(book);
            }
        }
        resolve(booksFound);
    })
}
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(isbn){
      const book = books[isbn];
      if(book){
          return res.send(book["reviews"]);
      }else{
         return res.send("Book not found");
      }
    }
    return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
