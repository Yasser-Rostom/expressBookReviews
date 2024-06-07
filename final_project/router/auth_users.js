const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

function isValid(username) {//returns boolean
    return !users.some(user => user.username === username);
}
const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
      return true;
    } else {
      return false;
    }
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(username && password){
    if(authenticatedUser(username,password)){
        let accessToken = jwt.sign({
            data: password
        },'access', {expiresIn: 60 * 60});
        req.session.authorization ={
            accessToken,username
        }
        return res.status(200).send("User successfully logged in")
    }else     return res.status(208).json({message: "Invalid Login. Check username and password"});
    }else{
       return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    isbn = req.params.isbn;
    const userreview = req.body.review
    const book = books[isbn];
    if(book){
        let reviews = book.reviews;
        for(let review in reviews){
            if(review.username === username){
                review["review"] = userreview;
                return res.status(200).send("review updated successfully ${books[isbn]}");
            }else{
                book["reviews"].push({"username":username,"review":userreview});
                return res.status(200).send("review addded successfully ${books[isbn]}");

            }
        }
    }else{
        return res.status(404).send("Book not found!");

    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
