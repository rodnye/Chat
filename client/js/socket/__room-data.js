
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
        
        
        if (!msgView) {
            // initialize this chat UI
            msgView = new MessageViewComponent(roomName, roomType);
            msgView.roomId = roomId;
            
            msgViews[roomId] = msgView;
            msgViewsContainer.appendChild(msgView.view);
        }
        
        if (!room) {
            // initialize new room
            room = {
                id: roomRes.chat_id,
                type: roomRes.type,
                name: roomRes.name,
            };
            room.msgs = msgView.msgList;
        }
        else {
            const lastMsg = room.msgs[room.msgs.length - 1];
            if (lastMsg) {
               msgRequest.date = lastMsg.date;
            }
        }
        
        ROOMS[roomId] = room;
        msgRequestData.push(msgRequest);
    });
    
    
    // render the chats in list
    for (let roomId in ROOMS) {
        const room = ROOMS[roomId];
        const item = chatsListView.addItem({
            title: room.name,
            text: "",
            icon: room.type === "group" ? groupIcon : userIcon,
        });
        item.roomType = room.type;
        item.roomId = room.id;
    };
    
    // emit the rooms request
    socket.emit("get-room-mess", msgRequestData);
    
    stg.setData("rooms", ROOMS);
    loading.hide();
}