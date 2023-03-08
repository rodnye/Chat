/*
 * Layout Component
 */
let layoutVisible = null;


/**
 * Create a new layout
 *
 * @constructor
 * @param {string} css selector of element
 */
class LayoutComponent {
    
    constructor (selector) {
        const el = document.querySelector(selector);
        el.classList.add("layout");

        this.element = el;
        this.classList = el.classList;
        if (!layoutVisible) this.show();
    }


    /** 
     * show layout and hide actual visible layout
     */
    show () {
        if (this.visible) return;
        this.visible = true;
        this.classList.add("layout--visible");

        if (layoutVisible) layoutVisible.hide();
        layoutVisible = this;
    }

    /** 
     * hide layout
     */
    hide () {
        if (!this.visible) return;
        this.visible = false;
        this.classList.remove("layout--visible");
    }
    
    /**
     * query selector method
     */
    E (selector) {
        return this.element.querySelector(selector);
    }
}