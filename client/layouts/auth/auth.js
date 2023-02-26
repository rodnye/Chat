/**
 * Welcome Layout
 */
 
function createAuthLayout () {
    const layout = new ViewComponent("#auth-layout");
    const loginModal = new ModalComponent("#login-modal");
    
    loginModal.show()
    
    return layout;
}