/**
 * Main Script
 */

// layouts
let loading;
let authLayout;


function main () {
    
    // init loading screen
    loading = createLoading();

    // init layouts
    authLayout = createAuthLayout();
    authLayout.show();
    
    console.log("All Loaded!");
}