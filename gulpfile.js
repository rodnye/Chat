const gulp = require("gulp");
const fs = require("fs");
const { JSDOM } = require("jsdom");

const config = require("./config.js");
const readRecursiveDirSync = require("./client/__read-recursive.js");
const router = require("./client/__router.js");


//
// framework compiler
//
gulp.task("build", end => {
    
    // target javascript files
    let buildJSFile = "";
    let buildHTMLFile = "";
    let buildCSSFile = "";
    
    // html index content
    const htmlFile = fs.readFileSync("./client/src/index.html");
    
    // document manager
    const { document } = new JSDOM(htmlFile).window;
    const headElement = document.querySelector("head");
    const bodyElement = document.querySelector("body");
    
    // add scripts, link and html elements
    const match = /(\.js|\.html|\.css)$/;
    readRecursiveDirSync("./client/src").forEach(fileName => {
        const [ext] = match.exec(fileName) || [];
        
        if (ext && !router.ignoreFiles.includes(fileName)) {
            const concatFile = "\n\n\n" + fs.readFileSync(fileName, "utf8");
            if (ext === ".js") buildJSFile += concatFile;
            if (ext === ".css") buildCSSFile += concatFile;
            if (ext === ".html") buildHTMLFile += concatFile;
        }
    });
    
    
    // add external dependencies
    for (let params of router.externalDependencies || []) {
        const type = params[0];
        const url = params[1];
        const onload = params[2];
       
        let element;
        if (type === "js") {
            element = document.createElement("script");
            element.src = url;
        }
        else if (type === "css") {
            element = document.createElement("link");
            element.rel = "stylesheet";
            element.href = url;
        }
        if (onload) element.setAttribute("onload", onload);
        headElement.appendChild(element);
    }
    
    if (router.onload) bodyElement.setAttribute("onload", router.onload);
    
    // set to document
    headElement.innerHTML += "<script src='/public/index.js'></script>";
    headElement.innerHTML += "<link href='/public/index.css' rel='stylesheet'>";
    bodyElement.innerHTML = buildHTMLFile;
    buildHTMLFile = document.querySelector("html").outerHTML;
    
    // build files
    fs.writeFileSync("./client/dist/index.html", buildHTMLFile, "utf8");
    fs.writeFileSync("./client/dist/index.js", buildJSFile, "utf8");
    fs.writeFileSync("./client/dist/index.css", buildCSSFile, "utf8");
    
    end();
});