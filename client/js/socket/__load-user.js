

function socketLoadUser (data) {
    
    // save user info
    USER.id = data.user_id;
    USER.nick = data.nickname;
    USER.color = data.color;
    USER.email = data.email;
    stg.setData("user", USER);
    
    
    // save user contacts 
    data.contacts.forEach(contact => {
        CONTACTS[contact.user_id] = contact;
    });
    stg.setData("contacts", CONTACTS);
    updateContactsList();
    
    
    loading.show("Cargando Chats...");
    socket.emit("get-room-data", "get");
}