/**
 * Messages View Component
 */
 

class MessageViewComponent extends EventEmitter3 {
    
    constructor (roomData) {
        super();
        const view = document.createElement("div");
        
        view.classList.add("msg-view");
        
        if (roomData.type === "group") {
            view.classList.add("msg-view--group");
        }
        
        this.view = view;
        this.msgMap = {};
        this.msgElementMap = {};
        this.msgArrivIdMap = {};
        this.roomId = roomData.id;
        this.roomName = roomData.name;
        this.roomType = roomData.type;
        
        this.hide();
    }
    
    
    /**
     * add a new message in view
     */
    addMessage ({
        sender, 
        msgId, 
        msgArrivId, // optional
        content, 
        type
    }) {
        const view = this.view;
        const msgList = this.msgList;
        const msgMap = this.msgMap;
        const msgBubble = document.createElement("div");
        
        msgBubble.classList.add("msg");
        
        
        if (this.roomType == "group") {
            // is a chat group!
            // add sender name of sms
            const msgSender = document.createElement("div");
            msgSender.classList.add("msg__sender");
            msgSender.innerText = sender;
            msgBubble.appendChild(msgSender);
        }
        
        //
        // add message content
        //
        view.appendChild(msgBubble);
       
        if (!type || type === "text") {
            // is a text message!
            const msgText = document.createElement("div");
            msgText.classList.add("msg__text");
            msgText.innerText = content;
            msgBubble.appendChild(msgText);
        }
        
        
        if (sender === USER.nick) {
            // sender is the user!
            // add clock
            const msgStatusIcon = document.createElement("i");
            msgStatusIcon.setAttribute("class", "msg__status fa fa-clock");
            
            msgBubble.classList.add("msg--user");
            msgBubble.appendChild(msgStatusIcon);
        }
        else {
            msgBubble.classList.add("msg--contact");
        }

        
        //
        // add message to register
        //
        const msgData = {
            msgId,
            msgArrivId,
            sender, 
            content, 
            type, 
        };
        
        msgMap[msgId] = msgData;
        this.msgElementMap[msgId] = msgBubble;
        
        // if message arrived
        if (msgArrivId) this.setMessageArrived(msgId, msgArrivId);
        
        // emit event
        this.emit("add-msg", {
            sender, 
            msgId, 
            msgArrivId,
            content, 
            type,
            roomId: this.roomId,
        });
    }
    
    /**
     * arrive message to server (only user's own messages)
     */
    setMessageArrived (msgId, msgArrivId) {
        const msgBubble = this.msgElementMap[msgId];
        const msgStatusIcon = msgBubble.querySelector(".msg__status");
        
        msgStatusIcon.setAttribute("class", "msg__status fa fa-check");
       
        this.msgMap[msgId].msgArrivId = msgArrivId;
        this.msgArrivIdMap[msgArrivId] = msgId;
        
        // emit event
        this.emit("arriv-msg", {
            msgId,
            msgArrivId,
            roomId: this.roomId,
        });
    }
    
    
    /**
     * visibility 
     */
    show () {this.view.classList.remove("d-none")}
    hide () {this.view.classList.add("d-none")}
}