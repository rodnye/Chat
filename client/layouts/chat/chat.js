

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
        msgViewVisible.draft = chatInput.innerText;
    });
    
    
    /**
     * Event: submit btn
     */
    layout.E(".chatbar__submit").addEventListener("click", () => {
        const content = chatInput.innerText.trim();
        if (!content) return;
        
        msgViewVisible.addMessage({
            sender: USER.name,
            type: "text",
            content,
        });
        
        // send message
        socket.emit("message", {
            arriv_id: randomInt(1000, 9999),
            chat_id: msgViewVisible.roomId,
            type: "text",
            message: content,
        });
        
        chatInput.innerText = "";
        chatInput.focus();
    });
    
    
    
    /**
     * Event: chatsListView items
     */
    chatsListView.addListener("click", item => {
        const roomId = item.roomId;
        const roomName = item.title;
        let room = ROOMS[roomId];
        let msgView = msgViews[roomId];
        
        contactNameEl.innerText = roomName;
        contactStateEl.innerText = "En linea";
        chatInput.innerText = msgView.draft || "";
        
        if (msgViewVisible) msgViewVisible.hide();
        msgView.show();
        msgViewVisible = msgView;
        
        chatLayout.show();
    });
    
    return layout;
}

