
const fs = require("fs");
const path = require("path");
const dom = require("./__dom.js");
const readRecursiveDirSync = require("./__recursive.js");

/**
 * bundler promise 
 * 
 * @params *see bundler()
 * @return {Promise}
 */
function bundlerPromise (options) {
    return new Promise ((resolve, reject) => {
        try {
            bundler(options);
            resolve();
        }
        catch (err) {
            reject(err);
        }
    });
}


/**
 * synchronous bundler 
 * 
 * @param options.src           {string} folder path to get files 
 * @param options.dist          {string} folder path to save built files 
 * @param options.url           {string} URL where the built files are located 
 * @param options.ignoreFiles   {string[]} file paths to ignore 
 * @param options.externalFiles {string[]} others externals URL to add
 */
function bundler (options = {}) {
    
    // paths
    const srcDir = options.src;
    const distDir = options.dist;
    const serverUrl = options.url || "./";
    
    // target files
    let buildJSFile = "";
    let buildHTMLFile = "";
    let buildCSSFile = "";
    
    
    // html elements
    const htmlElement = dom.createFullDocument();
    const headElement = htmlElement.children[0];
    const bodyElement = htmlElement.children[1];
    
    
    // add scripts, link and html elements
    const match = /(\.js|\.html|\.css)$/;
    const ignoreFiles = options.ignoreFiles || [];
    
    readRecursiveDirSync(srcDir).forEach(fileName => {
        // file extension 
        const [ext] = match.exec(fileName) || [];
        
        if (ext && !ignoreFiles.includes(fileName)) {
            const concatFile = "\n\n\n" + fs.readFileSync(fileName, "UTF-8");
            if (ext === ".js") buildJSFile += concatFile;
            if (ext === ".css") buildCSSFile += concatFile;
            if (ext === ".html") buildHTMLFile += concatFile;
        }
    });
    
    
    // add external dependencies
    for (let params of options.externalFiles || []) {
        const type = params[0];
        const url = params[1];
        const onload = params[2];
       
        let element;
        if (type === "js") {
            // is a script!
            element = new dom.Element("script", {
                src: url
            });
        }
        
        else if (type === "css") {
            // is a style!
            element = new dom.Element("link", {
                rel: "stylesheet",
                href: url
            });
        }
        
        if (onload) element.setAttr("onload", onload);
        headElement.appendChild(element);
    }
    
    // have a global load event
    if (options.onload) bodyElement.setAttr("onload", options.onload);
    
    // set to document
    bodyElement.innerHTML = buildHTMLFile;
    headElement.appendChild(
        new dom.Element("script", {
            src: path.join(serverUrl, "/index.js"),
        }),
        new dom.Element("link", {
            href: path.join(serverUrl, "/index.css"),
            rel: "stylesheet"
        }),
    );
    buildHTMLFile = "<!DOCTYPE html>" + htmlElement.render();
    
    // build files
    fs.writeFileSync(path.join(distDir, "/index.html"), buildHTMLFile, "UTF-8");
    fs.writeFileSync(path.join(distDir, "/index.js"), buildJSFile, "UTF-8");
    fs.writeFileSync(path.join(distDir, "/index.css"), buildCSSFile, "UTF-8");
    
}


module.exports = {
    bundler,
    bundlerPromise,
};