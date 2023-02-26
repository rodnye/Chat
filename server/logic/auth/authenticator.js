const config = require("../../../config.js"); 
  
 const jwt = require("jsonwebtoken"); 
  
 function generate(_id, expi) { 
     if (_id == null || _id == undefined) return null; 
     return jwt.sign({ 
         id: _id 
     }, config.TOKEN.secret, { 
         expiresIn: (expi ? expi : config.TOKEN.expire) 
     }); 
 } 
  
 function verify(_token) { 
     let token; 
  
     if (_token != undefined) token = _token; 
     if (token == null || token == undefined) return false; 
     return jwt.verify(token, config.TOKEN.secret, err => { 
         if (err) return false; 
         return jwt.decode(token).id; 
     }); 
 } 
  
 module.exports = { 
     generate, 
     verify 
 };