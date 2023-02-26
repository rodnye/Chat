//
// files router
//

new Import()
    
    // start browser console
    .js("node_modules/eruda/eruda.js")
    .then(() => eruda.init())
    
    // main files
    .js("js/main.js")
    .css("css/main.css")
    
    // start app
    .then(() => main());