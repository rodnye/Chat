
function socketRoomData (rooms) {
    const groupIcon = "fa-users fa-lg";
    const userIcon = "fa-user fa-lg";
    
    rooms.forEach(room => {
        ROOMS[room.name] = room;
    });
    
    
    // render the chats in list
    for (let roomName in ROOMS) {
        const room = ROOMS[roomName];
       
        chatsListView.addItem({
            title: roomName,
            text: "",
            icon: room.type === "group" ? groupIcon : userIcon,
        });
    };
    
    stg.setData("rooms", ROOMS);
    loading.hide();
}