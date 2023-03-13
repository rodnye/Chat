
function socketRoomData (rooms) {
    const groupIcon = "fa-users fa-lg";
    const userIcon = "fa-user fa-lg";
    const msgRequestData = [];
    
    rooms.forEach(roomRes => {
        const roomId = roomRes.chat_id;
        const roomName = roomRes.name;
        const roomType = roomRes.type;
        
        let room = ROOMS[roomId];
        let msgView = msgViews[roomId];
        
        
        // message request to server
        const msgRequest = {
            chat_id: roomId, 
            date: 0,
        };
        
        
        if (!room) {
            // room not stored!
            // initialize 
            room = {
                id: roomRes.chat_id,
                type: roomRes.type,
                name: roomRes.name,
            };
        }
        
        if (!msgView) {
            // room not render!
            // initialize UI
            msgView = new MessageViewComponent(room);
            const msgMap = msgView.msgMap;   // message map
            const chatListItem = chatListView.addItem({
                title: room.name,
                text: "",
                icon: room.type === "group" ? groupIcon : userIcon,
            });
            
            chatListItem.roomType = room.type;
            chatListItem.roomId = room.id;
            
            msgView.roomId = roomId;
            msgView.addListener("add-msg", onMsgViewMessage, chatListItem);
            msgView.addListener("arriv-msg", onMsgViewMessageArrived);
            
            
            const msgMapStored = room.msgMap;
            const msgArrivIdMapStored = room.msgArrivIds;
           
            room.msgMap = msgView.msgMap;
            room.msgArrivIds = msgView.msgArrivIdMap;
            
            // if there are messages stored, render them asynchronously
            if (msgMapStored) execAsync(() => {
                for (let msgId in msgMapStored) {
                    const msgData = msgMapStored[msgId];
                    msgView.addMessage(msgData);
                }
            });
            
            msgView.chatListItem = chatListItem;
            msgViews[roomId] = msgView;
            msgViewsContainer.appendChild(msgView.view);
        }
        
        
        
        ROOMS[roomId] = room;
        msgRequestData.push(msgRequest);
    });
    
    
    
    // emit the rooms request
    socket.emit("get-room-mess", msgRequestData);
    
    stg.setData("rooms", ROOMS);
    loading.hide();
}


/**
 * Event: add message to MessageView
 */
function onMsgViewMessage ({sender, content}) {
    const chatListItem = this; //context
    
    let text;
    if (USER.nick === sender) text = "Yo: " + content;
    else text = sender + ":" + content;
    
    chatListItem.setText(text);
    stg.setData("rooms", ROOMS);
}



/**
 * Event: message arrived on the server
 */
function onMsgViewMessageArrived ({msgView, msgId, msgArrivId}) {
    stg.setData("rooms", ROOMS);
}
