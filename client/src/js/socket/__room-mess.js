/**
 * Socket get-room-mess
 * get the messages of a room
 */

function socketRoomMess (data) {
    
    for (let msg of data) {
        const room = ROOMS[msg.chat_id];
        room.msgList.push(msg);
    }
    
}