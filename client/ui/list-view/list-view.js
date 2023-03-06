/**
 * List View UI Component
 */
 

/**
 * Setup a new ListView
 *
 * @constructor
 * @param {string} css selector of element
 */
class ListViewComponent {
    
    constructor (selector) {
        const listView = document.querySelector(selector);
        const items = listView.getElementsByClassName("list-view__item");

        this.listView = listView;
        this.items = [];
        
        // link to use element
        this.element = listView;
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
     * Add a list item 
     * 
     * @see Item_ListViewComponent constructor
     */
    addItem(itemData) {
        const item = new Item_ListViewComponent(itemData);
        this.listView.appendChild(item.element);
        this.items.push(item);
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
    
    
    /**
     * Add a listener
     */
    addListener (eventName, callback) {
        this.listView.addEventListener(eventName, event => {
            const item = event.relatedTarget;
            const itemData = item.dataset;
            callback();
        });
    }
}