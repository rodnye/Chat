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
    loginModal.E(".modal__body .link").addEventListener("click", toggleAuthModals);
    loginModal.E(".modal__footer .btn").addEventListener("click", sendLoginData);
    loginModal.show();
    
    if (USER.name) {
        loginModal.E("input[name='name']").value = USER.name;
        loginModal.E("input[name='pass']").value = USER.pass;
    }
   
    //
    // SignUp Modal
    //
    signupModal = new ModalComponent("#signup-modal");
    signupModal.E(".modal__body .link").addEventListener("click", toggleAuthModals);
    signupModal.E(".modal__footer .btn").addEventListener("click", sendSignupData);
    
    
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