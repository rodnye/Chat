/*
 * Modal Component
 */

/**
 * Create a new modal
 *
 * @constructor
 * @param {String} selector - css selector of element
 * @param {Object} options
 */
class ModalComponent {
    
    constructor (selector, options = {}) {
        const modal = document.querySelector(selector);
        const modalDialog = modal.querySelector(".modal_dialog");
        
       
        // show modal animation
        let showAnimation = new Animate({
            duration: 500,
            timing: Animate.LINEAR,
            draw (n) {
                modal.style.opacity = n * 100 + "%";
                modal.style.transform = "scale(" + (1 + (1 - n)/2)+ ")";
            }
        });
    
        // hide modal animation
        let hideAnimation = new Animate({
            duration: 500,
            timing: Animate.REVERSE,
            draw: showAnimation.draw
        });
        
        
        showAnimation.on("play", () => modal.classList.add("modal--visible"));
        hideAnimation.on("end", () => modal.classList.remove("modal--visible"));
        
        
        this.modal = modal;
        this.dialog = modalDialog;
        this.showAnimation = showAnimation;
        this.hideAnimation = hideAnimation;
        
    }
    
    
    /**
     * querySelector method
     * @param {String} css selector of element
     * @return {HTMLElement} result of search
     */
    E (selector) {
        return this.modal.querySelector(selector);
    }
     
    
    
    
    /**
     * show modal dialog
     */
    show () {
        if (this.visible) return;
        this.visible = true;
        this.showAnimation.play();
    }
    
    /**
     * hide modal dialog
     */
    hide () {
        if (!this.visible) return;
        this.visible = false;
        this.hideAnimation.play();
    }
}