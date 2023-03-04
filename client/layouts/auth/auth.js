/**
 * Welcome Layout
 */

let loginModal;
let signupModal;


function createAuthLayout () {
    const layout = new LayoutComponent("#auth-layout");
    
    //
    // LogIn Modal
    //
    loginModal = new ModalComponent("#login-modal");
    loginModal.E("span.link").addEventListener("click", toggleAuthModals);
    loginModal.E("button.submit").addEventListener("click", sendLoginData);
    loginModal.show();
   
    //
    // SignUp Modal
    //
    signupModal = new ModalComponent("#signup-modal");
    signupModal.E("span.link").addEventListener("click", toggleAuthModals);
    signupModal.E("button.submit").addEventListener("click", sendSignupData);
    
    
    return layout;
}



/**
 * change SignUp Modal to LogIn Modal or viceversa
 */
function toggleAuthModals () {
    if (loginModal.visible) {
        loginModal.hide();
        signupModal.show();
    }
    else if (signupModal.visible) {
        signupModal.hide();
        loginModal.show();
    }
    else loginModal.show();
}