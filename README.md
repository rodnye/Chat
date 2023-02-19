# Chat
A public web application to chat and send multimedia files.


## Init
To start the server in production mode, use:
```
npm start
```  
  
If you want to enable the test mode, use:
```
npm test
```


## File Structure
```
├── main.js           // main server file
├── config.js         // generic and global constants
├── package.json
├── client            // public files to show in client side
│   ├── index.html    // main view
│   ├── css
│   │   └── main.css
│   └── js
│       └── main.js
└── server            // files to server run
    └── server.js
```