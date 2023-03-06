/**
 * Connection with Socket.io
 */

// client-socket manager
let socket;

function connectToSocket () {
    
    // connect
    socket = io.connect("/client", {
        query: "token=" + USER.token,
        cors: { origin: null }
    });
    
    
    // connection success!
    socket.on("connect", data => {
        console.log("WB connected!", data);
        loading.show("Cargando Chats...");
    });
    
    // inform on any event launched
    socket.onAny((event, data) => console.log("WS " + event + ":", data));
}