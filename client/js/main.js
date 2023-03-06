/**
 * Main Script
 */
 
// config
const APP_NAME = "Chat";
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
    
    authLayout.show();
    //mainLayout.show();
    
    console.log("All Loaded!");
}