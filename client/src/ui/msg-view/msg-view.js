/**
 * Messages View Component 
 * 
 * @param {RoomData} 
 * @param options.disableSwipe {boolean} 
 * 
 * @event add-msg
 * @event arriv-msg
 * @event dblclick-msg
 * @event swipe-msg
 */

class MessageViewComponent extends EventEmitter3 {
    
    constructor (roomData, options = {}) {
        super();
        const view = document.createElement("div");
        
        view.classList.add("msg-view");
        
        if (roomData.type === "group") {
            view.classList.add("msg-view--group");
        }
        
        
        function findMsgBubble (element) {
            return findParentElement(element, element => {
                return element.classList.contains("msg");
            }, 3);
        }
        
        // 
        // Event: double click msg bubble
        //
        view.addEventListener("dblclick", event => {
            const msgBubble = findMsgBubble(event.target);
            if (!msgBubble) return;
            
            let msgId = msgBubble.dataset.msgId;
            this.emit("dblclick-msg", this.msgMap[msgId]);
        });
        
        //
        // Event: swipe msg bubble
        //
        if (!options.disableSwipe) {
            let msgBubbleMoving = null;
            let msgData = null;
            let mouseStartX = 0;
            let movementX = 0;

            // start swipe
            view.addEventListener("touchstart", event => {
                event = event.targetTouches[0];
                const msgBubble = findMsgBubble(event.target);
                if (!msgBubble) return;
                
                mouseStartX = event.pageX;
                msgBubbleMoving = msgBubble;
                
                let msgId = msgBubble.dataset.msgId;
                msgData = this.msgMap[msgId];
            });
            
            // move
            view.addEventListener("touchmove", event => {
                event = event.targetTouches[0];
                if (!msgBubbleMoving) return;
                
                let mouseX = event.pageX;
                movementX = (mouseStartX - mouseX) / 5;
                
                if (movementX < 0) movementX = 0;
                 msgBubbleMoving.style.right = movementX + "px"
            });
            
            // end swipe
            view.addEventListener("touchend", event => {
                event = event.targetTouches[0];
                if (!msgBubbleMoving) return;
                
                // emit event swipe-msg
                if (movementX > 5) this.emit("swipe-msg", msgData);
                
                msgBubbleMoving.style.right = "0";
                mouseStartX = 0;
                movementX = 0;
                msgBubbleMoving = null;
                msgData = null;
            });
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
        msgReplyId, // optional
        msgArrivId, // optional
        content, 
        type
    }) {
        const view = this.view;
        const msgList = this.msgList;
        const msgMap = this.msgMap;
        const msgBubble = document.createElement("div");
        
        msgBubble.classList.add("msg");
        msgBubble.dataset.msgId = msgId;
       
       
        if (msgReplyId) {
            // is replying to a message!
            // create reply box elements
            const msgReplyData = this.msgMap[msgReplyId];
            const replyBox = document.createElement("div");
            const replyBoxSender = document.createElement("div");
            const replyBoxText = document.createElement("div");
            
            // set class names
            replyBox.className = "msg__reply-box reply-box";
            replyBoxSender.className = "reply-box__sender";
            replyBoxText.className = "reply-box__text";
            
            // set content
            replyBoxSender.innerText = 
                 msgReplyData.sender === USER.nick ? "Tú" : msgReplyData.sender;
            replyBoxText.innerText = msgReplyData.content;
            
            // add elements
            replyBox.appendChild(replyBoxSender);
            replyBox.appendChild(replyBoxText);
            msgBubble.appendChild(replyBox);
        }
        
        
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
            msgReplyId,
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

