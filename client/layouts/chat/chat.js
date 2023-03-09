

const msgViews = {};
let msgViewVisible;
let msgViewsContainer;
let chatsListView;

function createChatLayout () {
    const layout = new LayoutComponent("#chat-layout");
  
    chatsListView = new ListViewComponent("#main-layout > .list-view");
    msgViewsContainer = layout.E("#chat-body");
    
    const contactNameEl = layout.E(".contact-name");
    const contactStateEl = layout.E(".contact-state");
    const chatInput = layout.E(".chatbar__input");
    
    
    
    /**
     * Event: back arrow
     */
    layout.E(".btn-back").addEventListener("click", () => {
        mainLayout.show();
        
        // save temporary message not finished
        msgViewVisible.draftHTML = chatInput.innerHTML;
    });
    
    
    
    /**
     * Event: chatsListView items
     */
    chatsListView.addListener("click", item => {
        const roomId = item.title;
        let room = ROOMS[roomId];
        let msgView = msgViews[roomId];
        
        if (!msgView) {
            // initialize this chat UI
            msgView = new MessageViewComponent(roomId, item.type);
            msgViews[roomId] = msgView;
            
            msgViewsContainer.appendChild(msgView.view);
        }
        if (!room) {
            // initialize new room
            room = {msgList:[]};
            ROOMS[item.title] = room;
        }
        
        contactNameEl.innerText = roomId;
        contactStateEl.innerText = "En linea";
        chatInput.innerHTML = msgView.draftHTML || "";
        
        if (msgViewVisible) msgViewVisible.hide();
        msgView.show();
        msgViewVisible = msgView;
        
        chatLayout.show();
    });
    
    return layout;
}

