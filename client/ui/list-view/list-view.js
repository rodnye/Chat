/**
 * List View UI Component
 */
 

/**
 * Setup a new ListView
 *
 * @constructor
 * @param {string} css selector of element
 */
class ListViewComponent extends EventEmitter3 {
    
    constructor (selector) {
        super();
        const listView = document.querySelector(selector);
        const items = listView.getElementsByClassName("list-view__item");

        this.listView = listView;
        this.items = [];
        
        // link to use element
        this.element = listView;
        
        
        listView.addEventListener("click", event => {
            let itemEl = event.target;
            
            // find the li element in target
            let limit = 3;
            while (!itemEl.dataset.title) {
               itemEl = itemEl.parentNode;
               if (!limit) return;
               limit --;
            }
            
            const item = this.getItemByTitle(itemEl.dataset.title);
            this.emit("click", item);
        });
    }

    /**
     * Get the item
     *
     * @param  {number} item index in list
     * @return {Item_ListViewComponent}
     */
    getItem(index) {
        return this.items[index];
    }
    
    
    /**
     * Get the item by title
     *
     * @param  {string} item title in list
     * @return {Item_ListViewComponent}
     */
    getItemByTitle (title) {
        const items = this.items;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.title === title) return item;
        }
        
        return null;
    }
    
    
    
    /**
     * Remove a item 
     * 
     * @param {number} item index to remove
     */
    removeItem (index) {
        const item = this.getItem(index);
        const itemEl = item.element;
        
        this.items.slice(index, 1);
        this.listView.removeChild(itemEl);
        itemEl.remove();
        
        if (Object.destroy) Object.destroy(item);
    }
    
    /**
     * remove all items
     */
    removeAllItems () {
        while (this.items[0]) this.removeItem(0);
    }
    
    /**
     * Add a list item 
     * 
     * @see Item_ListViewComponent constructor
     * @return {Item_ListViewComponent}
     */
    addItem (itemData) {
        const item = new Item_ListViewComponent(itemData);
        this.listView.appendChild(item.element);
        this.items.push(item);
        return item;
    }


    /**
     * Scroll to a list item
     * 
     * @param {number} item index 
     */
    scrollTo (index) {
        const items = this.items;
        const item = items[index];
        let top = 0;
        
        if (item) {
            for (let i = 0; i < index; i++) top += items[i].clientHeight;
          
            this.listView.scrollTo({
                top,
                left: 0,
                behavior: "smooth"
            });
        }
    }
}