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
        senderId: data.user_id,
        senderColor: data.user_color,
        
        type: "text",
        msgReplyId: msgView.msgArrivIdMap[data.reply],
        content: msgContent
    });
    scrollToChatBottom(msgView);
}


/**
 * Socket Arriv Message 
 * confirmation of sent Message
 */
function socketArrivMessage (data) {
    const roomId = data.chat_id;
    const msgArrivId = data.mess_id;
    const msgId = data.arriv_id;
    
    const msgView = msgViews[roomId];
    msgView.setMessageArrived(msgId, msgArrivId);
}


