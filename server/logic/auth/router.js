/*************** 
  * Router File * 
  ***************/ 
  
 const router = require("express").Router(); 
 const login = require("./login.js"); 
 const signup = require("./signup.js"); 
  
 router.post("/login" , login); 
 router.post("/signup" , signup); 
  
  
 module.exports = router;