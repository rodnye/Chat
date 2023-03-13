
function sendSignupData () {
    
    const form = {
        username:  signupModal.E("input[name='name']").value,
        email:     signupModal.E("input[name='email']").value,
        password:  signupModal.E("input[name='pass']").value,
        rpassword: signupModal.E("input[name='rpass']").value,
    };
    
    loading.show("Registrando...");
    
    
    // REQUEST
    fetch("/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
    })
    
    .then(res => res.json())
    .then(({status, data}) => {
        loading.hide();
        alert(data);
        
        if (status) {
            // register success!!
            loginModal.E("input[name='name']").value = form.username;
            loginModal.E("input[name='pass']").value = form.password;
            toggleAuthModals(); // redirect to logIn
        }
    });
    
}