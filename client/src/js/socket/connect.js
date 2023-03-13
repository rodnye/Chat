/**
 * Connection with Socket.io
 */

let socket; // client-socket manager

function connectToSocket () {
    
    // connect
    socket = io.connect("/client", {
        query: "token=" + USER.token,
        cors: { origin: null }
    });
    
    
    // connection success!
    socket.on("connect", data => {
        console.log("WB connected!", data);
        loading.show("Cargando Contactos...");
    });
    
    socket.on("message", socketMessage);
    socket.on("arriv-mess", socketArrivMessage);
    socket.on("load-user", socketLoadUser);
    socket.on("get-room-data", socketRoomData);
    socket.on("get-room-mess", socketRoomMess);
    
    // inform on any event launched
    socket.onAny((event, data) => console.log("WS " + event + ":", data));
}