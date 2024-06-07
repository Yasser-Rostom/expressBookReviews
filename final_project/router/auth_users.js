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
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;
    const userReview = req.query.review;
    console.log("auth_user username ", username);
    console.log("auth_user username ",req.session);
    const book = books[isbn];

    if(book){
  
        let reviews = book.reviews;
        let userAlreadyReviewed = false;

        for (let reviewId in reviews) {
            if (reviews[reviewId].username === username) {
                // If user has already reviewed, update the review
                reviews[reviewId].review = userReview;
                userAlreadyReviewed = true;
                break;
            }
        }

        if (!userAlreadyReviewed) {
            // If user hasn't reviewed yet, add a new review
            const newReviewId = Object.keys(reviews).length + 1; // Generate new review ID
            reviews[newReviewId] = {
                username: username,
                review: userReview
            };
        }

        return res.status(200).send(`Review ${userAlreadyReviewed ? 'updated' : 'added'} successfully for ${book.title}`);
    } else {
        return res.status(404).send("Book not found!");
    }
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if(!book) {
        return res.status(404).send("Book not found!");

    }else{
        let reviewRemoved = false;
const username= req.session.authorization.username;
let reviews = book.reviews;
for(let reviewId in reviews){
    if(username=== reviews[reviewId].username){
        delete reviews[reviewId];
        reviewRemoved = true;
        break;
    }
}
if(reviewRemoved){
    return res.status(200).send(`Review removed successfully for ${book.title}`);
}else{
    return res.status(500).send(`Server error please try again`);

}
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
