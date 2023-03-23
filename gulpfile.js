
const gulp = require("gulp");
const postcss = require("postcss");
const path = require("path");
const fs = require("fs");

const config = require("./config.js");
const router = require("./client/router.js");
const { bundlerPromise } = require("./bundler/bundler.js");

//
// framework compiler
//
gulp.task("build", end => {
    const outputDir = router.dist;
    const cssFileDir = path.join(outputDir, "index.css");
    const jsFileDir = path.join(outputDir, "index.js");
    const htmlFileDir = path.join(outputDir, "index.html");
    
    bundlerPromise(router)
        .then(() => {
            // concat files ready!
            // parse css
            let cssFile = fs.readFileSync(cssFileDir, "UTF-8");
            
            return postcss([
                require("autoprefixer"),
            ]).process(cssFile);
        })
        
        .then(result => {
            // css parsed!
            fs.writeFileSync(cssFileDir, result.css, "UTF-8");
                    
             console.log("Compiled success!!");
             console.log(outputDir);
             end();
        })
        
        .catch(err => {
            end();
        });
        
});
