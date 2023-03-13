
function createFullDocument () {
    const html = new DOMElement("html", {lang: "es"});
    const head = new DOMElement("head", {});
    const body = new DOMElement("body", {});
    
    head.appendChild(
        new DOMElement("meta", {charset: "utf8"}),
        new DOMElement("meta", {
            name: "viewport", 
            content: "width=device-width, initial-scale=1.0"
        }),
    );
    html.appendChild(head, body);
    return html;
}

/**
 * a simple dom element
 */
class DOMElement {
    constructor (tag, attrMap) {
        this.tag = tag.toLowerCase();
        this.attrMap = attrMap || {};
        this.children = [];
        this.parentNode = null;
    }
    
    // show string content
    set innerHTML (text) {
        this.removeAllChilds();
        this.appendChild(new DOMTextNode(text));
    }
    get innerHTML () {
        let innerHTML = "";
        
        // render children
        this.children.forEach(child => {
            innerHTML += child.render();
        });
        
        return innerHTML;
    };
    
    
    setAttr (attr, value) {
        this.attrMap[attr] = value + "";
        return this;
    }
    
    getAttr (attr) {
        return this.attrMap[attr];
    }
    
    appendChild (...nodes) {
        nodes.forEach(node => {
            node.parentNode = this;
            this.children.push(node);
        });
    }
    
    removeAllChilds () {
        const children = this.children;
        children.splice(0, children.length);
    }
    
    
    /**
     * return complete html fragment of this element 
     */
    render () {
        let tag = this.tag;
        let innerHTML = this.innerHTML;
        let attrNode = "";
        
        // render attributes
        for (let key in this.attrMap) {
            let value = this.attrMap[key];
            attrNode += key + "=\"" + value + "\" ";
        }
        attrNode = attrNode.trim();
        if (attrNode.length) attrNode = " " + attrNode;
        
        return `<${tag}${attrNode}>${innerHTML}</${tag}>`
    }
}


class DOMTextNode {
    constructor (text) {
        this.parentNode = null;
        this.textContent = text;
    }
    
    render () {return this.textContent}
}

module.exports = {
    DOMElement,
    DOMTextNode,
    createFullDocument,
}