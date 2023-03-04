
function sendLoginData () {
    
    const form = {
        username: loginModal.E("input[name='name']").value,
        password: loginModal.E("input[name='pass']").value
    };
    loading.show("Autenticando...");
    
    // REQUEST
    fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form)
    })
    
    .then(res => res.json())
    .then(({status, data}) => {
        loading.hide();
        alert(data);
        
        if (status) {
            // logIn success!!
            const token = data;
            
            // save user information
            USER.name = form.username;
            USER.pass = form.password;
            USER.token = token;
            stg.setData("user", USER);
            
            connectToSocket(); // connect to server socket
            loginModal.hide(); // hide login
            mainLayout.show(); // redirect to main app
        }
    });
    
}