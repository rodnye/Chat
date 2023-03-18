# Chat
(still in development stages) \
A public web application to chat and send multimedia files.


## Init
First clone the repository and install all the dependencies
it needs with `npm install` 

 \
To start the server in production mode, use:
```shell
npm start
``` 

 \
If you want to enable the test mode, use:
```shell
npm test
```
Test mode includes the use of nodemon to detect changes in the `client/src/` 
directory and preprocess them in real time.



## File Structure
```
├── main.js            // main server file
├── config.js          // generic and global constants
│
├── gulpfile.js        // task manager with gulp
├── nodemon.json       // nodemon options
├── package.json
│
├── server/
│
├── client/
│   ├── src/           // client-side files
│   ├── dist/          // packaged client-side
│   └── router.js      // bundler options
│
└── bundler/           // files to process client-side
```
 
 
 
### Client - Side
`client/src/`
```
├── css/                  // global styles
│   └── main.js           // startup styles and themes
│
├── js/
│   ├── socket/           // sockets events, listeners and connections
│   ├── storage.js        // local storage manager
│   ├── animate.js        // javascript animation manager
│   ├── utils.js          // help functions
│   └── main.js           // startup script
│
├── layouts/              // html views and html sections with 
│                            their scripts and styles
└── ui/                   // user interface components to use than 
                             any layout
```