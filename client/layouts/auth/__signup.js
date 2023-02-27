
function sendSignupData () {
    
    loading.show("Registrando...");
    
    fetch("/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username:  signupModal.E("input[name='user']").value,
            email:     signupModal.E("input[name='email']").value,
            password:  signupModal.E("input[name='pass']").value,
            rpassword: signupModal.E("input[name='rpass']").value
        })
    })
    
    .then(res => res.json())
    .then(({status, data}) => {
        loading.hide();
        alert(data);
        if (status) toggleAuthModals();
    });
    
}