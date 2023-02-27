//
// files router
//

new Import("/public")
    
    // libraries
    .js("/node_modules/eruda/eruda.js").then(() => eruda.init())
    
    .css("/node_modules/bootstrap/dist/css/bootstrap-utilities.min.css")
    .css("/node_modules/@fortawesome/fontawesome-free/css/all.min.css")
    .js("js/animate.js")
    .js("js/storage.js")
    
    
    // UI components
    .link("ui/layout/layout", "css,js")
    .link("ui/modal/modal", "css,js")
    .link("ui/input/input", "css")
    .link("ui/button/button", "css")
    .css("ui/utils.css")
    
    
    // layouts
    .link("layouts/auth/auth", "html,css,js")
    .js("layouts/auth/__login.js")
    .js("layouts/auth/__signup.js")
    .link("layouts/loading__modal/loading", "html,css,js")
    
    
    // main files
    .js("js/main.js")
    .css("css/main.css")
    
    
    // start app
    .then(() => main());