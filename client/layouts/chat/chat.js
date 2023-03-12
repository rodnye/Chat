

const msgViews = {};
let msgViewVisible;
let msgViewsContainer;
let chatListView;

/**
 * create and initialize Chat Layout
 */
function createChatLayout () {
    const layout = new LayoutComponent("#chat-layout");
  
    chatListView = new ListViewComponent("#main-layout > .list-view");
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
        
        const msgId = generateNumericUid();
        msgViewVisible.addMessage({
            sender: USER.nick,
            type: "text",
            content,
            msgId,
        });
        
        // send message
        socket.emit("message", {
            arriv_id: msgId,
            chat_id: msgViewVisible.roomId,
            user_nick: USER.nick,
            type: "text",
            message: content,
        });
        
        chatInput.innerText = "";
        chatInput.focus();
        scrollToChatBottom();
    });
    
    
    
    /**
     * Event: chatListView items
     */
    chatListView.addListener("click", item => {
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
        scrollToChatBottom();
        
        chatLayout.show();
    });
    
    return layout;
}


/**
 * scroll message views 
 */
function scrollToChatBottom (msgView) {
    if (!msgView) msgView = msgViewVisible;
    
    const view = msgView.view;
    view.scrollTop = view.scrollHeight;
}