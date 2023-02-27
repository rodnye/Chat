
function sendLoginData () {
    
    loading.show("Autenticando...");
    
    fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            username:  signupModal.E("input[name='user']").value,
            password:  signupModal.E("input[name='pass']").value
        })
    })
    
    .then(res => res.json())
    .then(({status, data}) => {
        loading.hide();
        alert(data);
        if (status) toggleAuthModals();
    });
    
}