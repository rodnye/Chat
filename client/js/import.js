/**
 * DOM Importer
 */

/**
 * Create a new Import object
 *
 * @author Rodny Estrada
 * @class
 */
function Import () {
    let promise = new Promise(resolve => resolve("init"));
    let body = document.querySelector("body");
    let head = document.querySelector("head");
    
    // regexp
    let regJs = /\.js$/;
    let regCss = /\.css$/;
    let regHtml = /\.html$/;
    
    /**
     * Create a script tag
     *
     * @param {strig} url
     * @return {Import}
     */
    this.js = function (url) {
        promise = promise.then(text => {
            return new Promise((resolve, reject) => {
                const script = document.createElement("script");
                if (!regJs.test(url)) url += ".js";
                console.log(url)
                script.src = url;
                script.type = "text/javascript";
                script.addEventListener("error", () => console.error("Load Script Error: " + url));
                script.addEventListener("load", () => resolve(url));
                head.appendChild(script);
            });
        });
        
        return this;
    };
    
    
    /**
     * Import a CSS Styles 
     * 
     * @param {strig} url
     * @return {Import}
     */
    this.css = function (url) {
        promise = promise.then(text => {
            return new Promise((resolve, reject) => {
                const link = document.createElement("link");
                if (!regCss.test(url)) url += ".css";
                console.log(url);
                link.rel = "stylesheet";
                link.href = url;
                link.addEventListener("error", () => console.error("Load Style Error: " + url));
                link.addEventListener("load", () => resolve(url));
                head.appendChild(link);
            });
        });
        
        return this;
    };
    
    
    /**
     * Insert a html fragment in body document
     *
     * @param {strig} url
     * @return {Import}
     */
    this.html = function (url) {
        promise = promise.then(text => {
            if (!regHtml.test(url)) url += ".html";
            console.log(url);
            return new Promise((resolve, reject) => {
              fetch(url)
                .then(response => response.text())
                .then(text => {
                    body.innerHTML += text.replace(/\{\{.*?\}\}/g, str => {
                        return eval(str.replace(/^\{\{|\}\}$/g, ""));
                    });
                    resolve(url);
                })
                .catch(() => console.error("Load HTML Fragment Error: " + url));
            });
        });
        
        return this;
    }
    
    /**
     * Import html, css or js
     *
     * @param {string} url - a url without extension
     * @param {string} opt - string options quote separated "html,css,js"
     */
    this.link = function (url, opt) {
        if (opt.indexOf("html") > -1) this.html(url);
        if (opt.indexOf("css") > -1) this.css(url);
        if (opt.indexOf("js") > -1) this.js(url);
        return this;
    }
    
    /**
     * Load a callback
     */
    this.then = function (callback) {
        promise = promise.then(text => callback(text));
        return this;
    }
}