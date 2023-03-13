/**
 * Item of List View UI Component
 * 
 * 
 * @constructor 
 * @param {string} itemData.title
 * @param {string} itemData.text
 * @param {string | HTMLElement} itemData.icon
 */
class Item_ListViewComponent {
    constructor (itemData = {}) {
        // Setup
        // create elements
        const itemEl = document.createElement("li");
        const iconBox = document.createElement("span");
        const contentBox = document.createElement("div");
        const titleEl = document.createElement("p");
        const textEl = document.createElement("p");
        
        itemEl.classList.add("list-view__item");
        iconBox.classList.add("list-view__item-icon");
        titleEl.classList.add("list-view__item-title");
        textEl.classList.add("list-view__item-text");
        
        contentBox.appendChild(titleEl);
        contentBox.appendChild(textEl);
        itemEl.appendChild(iconBox);
        itemEl.appendChild(contentBox);
        
        // set public properties
        this.listView = null;
        this.item = itemEl;
        this._iconBox = iconBox;
        this._contentBox = contentBox;
        this._titleEl = titleEl;
        this._textEl = textEl;
        
        // link to use
        this.element = itemEl;
        
        // default item values
        this.setTitle(itemData.title);
        this.setText(itemData.text);
        this.setIcon(itemData.icon);
        
    }
    
    
    /**
     * Set a title 
     * 
     * @param {string}
     */
    setTitle (title) {
        title = title || "";
        
        this.title = title;
        this.item.dataset.title = title;
        this._titleEl.innerText = title || "";
    }
    
    
    /**
     * Set text content of item
     * 
     * @param {string} 
     */
    setText (text) {
        this.text = text;
        this._textEl.innerText = text;
    }
    
    
    /**
     * Set a icon in the left side
     * 
     * @param {string | HTMLElement}
     *         font awesome class or dom element
     */
    setIcon (icon) {
        const iconBox = this._iconBox;
        iconBox.innerHTML = "";
        
        // icon is a Font Awesome Icon!
        if (typeof icon === "string") {
            const iconEl = document.createElement("i");
            iconEl.classList.add("fa");
            
            for (let classToken of icon.split(" ")) {
                iconEl.classList.add(classToken);
            }
            iconBox.appendChild(iconEl);
        } 
        
        // icon is a HTMLElement!
        else if (icon instanceof HTMLElement) {
            iconBox.appendChild(icon);
        }
    }
}