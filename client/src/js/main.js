/**
 * Main Script
 */
 
// globals
let APP_NAME = "Chat";
let ROOMS;
let CONTACTS;
let USER;

// layouts
let loading;
let authLayout;
let mainLayout;


function main () {
    
    // globals
    ROOMS = stg.getData("rooms", {});
    CONTACTS = stg.getData("contacts", {});
    USER = stg.getData("user", {
        name:  null,
        pass:  null,
        token: null,
    });
    
    // init loading screen
    loading = createLoading();

    // init layouts
    authLayout = createAuthLayout();
    mainLayout = createMainLayout();
    chatLayout = createChatLayout();
    contactsLayout = createContactsLayout();
    
    authLayout.show();
    //mainLayout.show();
    
    console.log("All Loaded!");
}