
const gulp = require("gulp");
const fs = require("fs");

const config = require("./config.js");
const readRecursiveDirSync = require("./client/__read-recursive.js");
const { DOMElement, createFullDocument } = require("./client/__virtual-dom.js");
const router = require("./client/__router.js");


//
// framework compiler
//
gulp.task("build", end => {
    
    // target javascript files
    let buildJSFile = "";
    let buildHTMLFile = "";
    let buildCSSFile = "";
    
    // html element
    const htmlElement = createFullDocument();
    const headElement = htmlElement.children[0];
    const bodyElement = htmlElement.children[1];
    
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
        if (type === "js") element = new DOMElement("script", {src: url});
        else if (type === "css") {
            element = new DOMElement("link", {
                rel: "stylesheet",
                href: url
            });
        }
        if (onload) element.setAttr("onload", onload);
        headElement.appendChild(element);
    }
    
    if (router.onload) bodyElement.setAttr("onload", router.onload);
    
    // set to document
    bodyElement.innerHTML = buildHTMLFile;
    headElement.appendChild(
        new DOMElement("script", {src:"/public/index.js"}),
        new DOMElement("link", {
            href: "/public/index.css",
            rel: "stylesheet"
        }),
    );
    buildHTMLFile = "<!DOCTYPE html>" + htmlElement.render();
    
    // build files
    fs.writeFileSync("./client/dist/index.html", buildHTMLFile, "utf8");
    fs.writeFileSync("./client/dist/index.js", buildJSFile, "utf8");
    fs.writeFileSync("./client/dist/index.css", buildCSSFile, "utf8");
    
    end();
});
