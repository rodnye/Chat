/**
 * Messages View Component
 */
 

class MessageViewComponent {
    
    constructor (username, type) {
        const view = document.createElement("div");
        view.classList.add("msg-view");
        
        this.view = view;
        this.msgList = [];
        this.username = username;
        
        this.hide();
    }
    
    
    /**
     * add a new message in view
     */
    addMessage ({sender, id, content, type, index}) {
        const view = this.view;
        const msgList = this.msgList;
        const msgBubble = document.createElement("div");
        
        msgBubble.classList.add("msg");
        
        //
        // add message content
        //
        if (!type || type === "text") {
            // is a text message!
            const msgText = document.createElement("div");
            msgText.classList.add("msg__text");
            msgText.innerText = content;
            msgBubble.appendChild(msgText);
        }
        

        
        //
        // add message to register
        //
        const msgData = {sender, content, type, id};
        
        if (msgList.length || typeof index === "undefined") {
            msgList.push(msgData);
            view.appendChild(msgBubble);
        }
        else {
            const elements = view.getElementsByClassName("msg");
            view.insertBefore(msgBubble, elements[index]);
            msgList.splice(index, 0, msgData);
        }
    }
    
    /**
     * visibility 
     */
    show () {this.view.classList.remove("d-none")}
    hide () {this.view.classList.add("d-none")}
}