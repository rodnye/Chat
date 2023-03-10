/**
 * Socket message 
 * receive any message of a group or contact 
 */

function socketMessage (data) {
    const roomId = data.chat_id;
    const msgContent = data.message;
    
    const msgView = msgViews[roomId];
    const room = ROOMS[roomId];
    
    
    msgView.addMessage({
        sender: data.user_nick,
        type: "text",
        content: msgContent
    })
}