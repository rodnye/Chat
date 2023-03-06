
function createMainLayout () {
    const layout = new LayoutComponent("#main-layout");
    const chatListView = new ListViewComponent(".list-view");
    const icon = "fa-user fa-lg";
    
    chatListView.addItem({icon, title: "wii", text:"hola"})
   
    return layout;
}