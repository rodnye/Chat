

const msgViews = {};

let msgViewsContainer;
let msgViewVisible;
let chatListView;
let chatInput;
let chatReply;

/**
 * create and initialize Chat Layout
 */
function createChatLayout () {
    const layout = new LayoutComponent("#chat-layout");
  
    chatListView = new ListViewComponent("#main-layout > .list-view");
    msgViewsContainer = layout.E("#chat-body");
    chatInput = layout.E(".chatbar__input");
    chatReply = layout.E(".chatbar__reply-box");
    
    const contactNameEl = layout.E(".contact-name");
    const contactStateEl = layout.E(".contact-state");
    
    
    /**
     * Event: chat input 
     */
    chatInput.addEventListener("focus", () => {
        setTimeout(() => scrollToChatBottom(), 500);
    });
    
    chatReply.querySelector(".reply-box__cancel").addEventListener("click", selectMsgReply);
    
    /**
     * Event: back arrow
     */
    layout.E(".btn-back").addEventListener("click", () => {
        mainLayout.show();
        
        // save temporary message not finished
        msgViewVisible.draft = chatInput.innerText;
        msgViewVisible.msgReplyId = chatReply.dataset.msgId;
        selectMsgReply({});
    });
    
    
    /**
     * Event: submit btn
     */
    layout.E(".chatbar__submit").addEventListener("click", () => {
        const content = chatInput.innerText.trim();
        if (!content) return;
        
        const msgView = msgViewVisible;
        const msgId = generateNumericUid();
        const msgReplyId = msgView.msgReplyId;
        
        // add message
        msgView.addMessage({
            msgId,
            msgReplyId: msgView.msgReplyId,
            
            sender: USER.nick,
            type: "text",
            content,
        });
        
        // send message
        socket.emit("message", {
            chat_id: msgView.roomId,
            arriv_id: msgId,
            reply: msgView.msgMap[msgReplyId].msgArrivId || msgReplyId,
            
            user_nick: USER.nick,
            type: "text",
            message: content,
        });
        
        chatInput.innerText = "";      // clear chat input
        selectMsgReply({msgId: null}); // clear reply box
        
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
        
        
        if (msgViewVisible) {
            msgViewVisible.hide();
            selectMsgReply({
                roomId, 
                msgId: msgView.msgReplyId
            });
        }
        msgView.show();
        msgViewVisible = msgView;
        scrollToChatBottom();
        
        chatLayout.show();
    });
    
    return layout;
}


/**
 * render chat reply by dataset.msgId 
 */
function selectMsgReply (data = {}) {
    let roomId = data.roomId;
    let msgId = data.msgId;
    let dataset = chatReply.dataset;
    const msgView = roomId ? msgViews[roomId] : msgViewVisible;
    
    if (!msgId) {
        // remove reply
        delete dataset.msgId;
        delete dataset.roomId;
        delete msgView.msgReplyId;
        
        chatReply.classList.remove("chatbar__reply-box--show");
        return;
    }
    
    
    dataset.msgId = msgId;
    dataset.roomId = roomId;
    
    // render reply
    chatReply.classList.add("chatbar__reply-box--show");
    const msgData = msgView.msgMap[msgId];
    
    msgView.msgReplyId = msgData.msgId;
    
    let sender = msgData.sender === USER.nick ? "Tú" : msgData.sender;
    chatReply.querySelector(".reply-box__sender").innerText = sender;
    chatReply.querySelector(".reply-box__text").innerText = msgData.content;
}


/**
 * scroll message views 
 */
function scrollToChatBottom (msgView) {
    if (!msgView) msgView = msgViewVisible;
    
    const view = msgView.view;
    view.scrollTop = view.scrollHeight;
}