/**
 * Loading Modal
 */


function createLoading (options) {
    
    const loadingModal = new ModalComponent("#loading-modal");
    const loadingText = loadingModal.E(".loading-text");
    
    
    // add ellipsis to spinner
    const spinner = loadingModal.E(".lds-ellipsis");
    for (let i = 0; i < 4; i++) {
        const div = document.createElement("div");
        spinner.appendChild(div);
    }
    
    
    //
    // Loading
    //
    return {
        visible: false,
       
        // Show loadingModal with a text
        show (text = "") {
            loadingModal.show();
            loadingText.innerText = text;
            this.visible = true;
        },
        
        
        // Hide LoadingModal
        hide () {
            loadingModal.hide();
            this.visible = false;
        }
    };
}