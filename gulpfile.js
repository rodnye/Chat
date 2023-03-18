
const gulp = require("gulp");
const fs = require("fs");

const config = require("./config.js");
const router = require("./client/router.js");
const { bundlerPromise } = require("./bundler/bundler.js");

//
// framework compiler
//
gulp.task("build", end => {
    
    bundlerPromise(router)
        .then(() => {
            console.log("Compiled success!!");
            console.log(router.dist);
            end();
        })
        .catch(err => {
            console.error(err);
            end();
        });
        
});
