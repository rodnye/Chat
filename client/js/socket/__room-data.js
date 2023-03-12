
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
      
        const msgRequest = {
            chat_id: roomId, 
            date: 0, // get all msg from this date 
                     // 0 => all msg from user join
        };
        
        
        if (!room) {
            // initialize new room
            room = {
                id: roomRes.chat_id,
                type: roomRes.type,
                name: roomRes.name,
            };
        }
        else {
            const lastMsg = room.msgs[room.msgs.length - 1];
            if (lastMsg) {
               msgRequest.date = lastMsg.date;
            }
        }
        
        if (!msgView) {
            // initialize this chat UI
            msgView = new MessageViewComponent(roomName, roomType);
            const chatListItem = chatListView.addItem({
                title: room.name,
                text: "",
                icon: room.type === "group" ? groupIcon : userIcon,
            });
            chatListItem.roomType = room.type;
            chatListItem.roomId = room.id;
            
            msgView.roomId = roomId;
            msgView.addListener("add-msg", onMsgViewMessage, chatListItem);
            
            room.msgs = msgView.msgList;
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
    const chatListItem = this;
    
    let text;
    if (USER.nick === sender) text = "Yo: " + content;
    else text = sender + ":" + content;
    
    chatListItem.setText(text);
}