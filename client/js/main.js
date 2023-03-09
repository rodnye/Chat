/**
 * Main Script
 */
 
// globals
const APP_NAME = "Chat";
const ROOMS = stg.getData("rooms", {});
const CONTACTS = stg.getData("contacts", {});
const USER = stg.getData("user", {
    name:  null,
    pass:  null,
    token: null,
});

// layouts
let loading;
let authLayout;
let mainLayout;


function main () {
    
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