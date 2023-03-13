


function createMainLayout () {
    const layout = new LayoutComponent("#main-layout");
    const icon = "fa-user fa-lg";
    
    
    // Event: FAB
    layout.E(".fab").addEventListener("click", () => {
        contactsLayout.show();
    });
    
    return layout;
}