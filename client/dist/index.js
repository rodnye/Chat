


/**
 * AnimateJS
 */

/**
 * Create a new Animate object
 *
 * @author Rodny Estrada <rrodnyestrada1@gmail.com>
 * @class
 */

function Animate (cfg) {

    this.duration = cfg.duration;
    this.draw = cfg.draw;
    this.statics = cfg.statics;
    this.state = "stoped";
    this.frame = 0;

    // events
    this.eventHandler = {
        play: function() {},
        stop: function() {},
        pause: function() {},
        end: function() {}
    };

    // Frames per Second (fps)
    let fps = cfg.fps;
    if (typeof fps == "number") {
        this.requestAnimationFrame = function (callback) {
            setTimeout(function() {
                callback(performance.now());
            }, 1000 / fps);
        };
        this.fps = fps;
    } else this.fps = "auto";


    // timing
    let timing = cfg.timing || Animate.LINEAR;
    switch (cfg.erase) {
        // eraseOut
        case "out":
            this.timing = function (n) {
                return 1 - timing(1 - n);
            };
            break;

        // eraseInOut
        case "both": case "in-out":
            this.timing = function (n) {
                if (n <= 0.5) return timing(2 * n) / 2;
                else return (2 - timing(2 * (1 - n))) / 2;
            };
            break;

        // eraseIn
        default: this.timing = timing;
        }
    }


    // RENDER FRAME (DRAW)
    Animate.prototype.renderFrame = function (time) {
        let frame = (time - this.timeStart) / this.duration;
        if (frame >= 1) frame = 1;
        this.frame = frame;
        this.draw(this.timing(frame), this);

        if (frame < 1) {
            if (this.state == "playing") this.requestAnimationFrame(this.renderFrame.bind(this));
        } else {
            this.state = "stoped";
            this.eventHandler.end(this);
        }
    };


    // actions
    // CLONE ANIMATION
    Animate.prototype.clone = function () {
        return new Animate({
            duration: this.duration,
            fps: this.fps,
            statics: this.statics,
            timing: this.timing,
            draw: this.draw
        });
    }


    // DESTROY ANIMATION
    Animate.prototype.destroy = function () {
        this
        .on("stop", function() {})
        .stop();

        // eliminar propiedades
        let props = Object.keys(this);
        for (let i = 0; i < props.length; i++) delete this[props[i]];

        // eliminar prototipo
        Object.setPrototypeOf(this, null);
    }


    // PLAY ANIMATION
    Animate.prototype.play = function () {

        let timeStart = performance.now();
        if (this.state == "paused") timeStart -= this.duration * this.frame;
        this.timeStart = timeStart;

        this.state = "playing";
        this.eventHandler.play(this);
        this.renderFrame(timeStart);

        return this;
    };


    // STOP ANIMATION
    Animate.prototype.stop = function () {
        this.state = "stoped";
        this.eventHandler.stop(this);

        return this;
    };


    // PAUSE ANIMATION
    Animate.prototype.pause = function () {
        if (this.state == "playing") {
            this.state = "paused";
            this.eventHandler.pause(this);
        }

        return this;
    }


    // MOVE ANIMATION
    Animate.prototype.toFrame = function (frame) {
        let time = performance.now();
        this.state = "paused";
        this.timeStart = time - this.duration * frame;
        this.frame = frame;
        this.renderFrame(time);

        return this;
    }


    // EVENTS
    Animate.prototype.on = function (event, callback) {
        this.eventHandler[event] = callback;

        return this;
    };


    // TIMING
    Animate.prototype.requestAnimationFrame = function(fn) {
        window.requestAnimationFrame(fn)};
    Animate.LINEAR = function (n) {
        return n
    };
    Animate.REVERSE = function (n) {
        return 1 - n
    };
    Animate.QUAD = function (n) {
        return Math.pow(n, 2)
    };
    Animate.QUBIC = function (n) {
        return Math.pow(n, 3)
    };
    Animate.CIRC = function (n) {
        return 1 - Math.sin(Math.acos(n))
    };
    Animate.ARROW = function (n) {
        let x = 1.5;
        return Math.pow(n, 2) * ((x + 1) * n - x)
    };
    Animate.BOUNCE = function (n) {
        for (let a = 0, b = 1; 1; a += b, b /= 2) {
            if (n >= (7 - 4 * a) / 11) {
                return - Math.pow((11 - 6 * a - 11 * n) / 4, 2) + Math.pow(b, 2)
            }
        }
    };
    Animate.ELASTIC = function (n) {
        let x = 1.5;
        return Math.pow(2, 10 * (n - 1)) * Math.cos(20 * Math.PI * x / 3 * n)
    }


/**
 * Main Script
 */
 
// globals
let APP_NAME = "Chat";
let ROOMS;
let CONTACTS;
let USER;

// layouts
let loading;
let authLayout;
let mainLayout;


function main () {
    
    // globals
    ROOMS = stg.getData("rooms", {});
    CONTACTS = stg.getData("contacts", {});
    USER = stg.getData("user", {
        name:  null,
        pass:  null,
        token: null,
    });
    
    // init loading screen
    loading = createLoading();

    // init layouts
    authLayout = createAuthLayout();
    mainLayout = createMainLayout();
    chatLayout = createChatLayout();
    contactsLayout = createContactsLayout();
    
    authLayout.show();
    //mainLayout.show();
    
    console.log("All Loaded!");
}




function socketLoadUser (data) {
    
    // save user info
    USER.id = data.user_id;
    USER.nick = data.nickname;
    USER.color = data.color;
    USER.email = data.email;
    stg.setData("user", USER);
    
    
    // save user contacts 
    data.contacts.forEach(contact => {
        CONTACTS[contact.user_id] = contact;
    });
    stg.setData("contacts", CONTACTS);
    updateContactsList();
    
    
    loading.show("Cargando Chats...");
    socket.emit("get-room-data", "get");
}


/**
 * Socket message 
 * receive any message of a group or contact 
 */

function socketMessage (data) {
    const roomId = data.chat_id;
    const msgContent = data.message;
    
    const msgView = msgViews[roomId];
    const room = ROOMS[roomId];
    
    
    msgView.addMessage({
        sender: data.user_nick,
        type: "text",
        content: msgContent
    });
    scrollToChatBottom(msgView);
}


/**
 * Socket Arriv Message 
 * confirmation of sent Message
 */
function socketArrivMessage (data) {
    const roomId = data.chat_id;
    const msgArrivId = data.mess_id;
    const msgId = data.arriv_id;
    
    const msgView = msgViews[roomId];
    msgView.setMessageArrived(msgId, msgArrivId);
}






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


/**
 * LocalStorage Manager
 */
 
const stg = {
    
    // database
    // not use directly, instead getData
    db: (() => {
        const db = localStorage.getItem("storage");
        
        if (db) return JSON.parse(db);
        return {};
    })(),
    
    
    
    /**
     * Get a stored value 
     * 
     * @param  {string} id - name of stored value
     * @param  {*} dfl - if not stored value, return this
     * @return {*} stored value or `dfl`
     */
    getData (id, dfl) {
        if (this.existsData(id)) return this.db[id];
        return dfl;
    },
    
    
    
    /**
     * Set a value 
     * 
     * @param  {string} id - name of value
     * @param  {*} value - a value to store
     * @return {*} the `value` param
     */
    setData (id, value) {
        this.db[id] = value;
        this.save();
        return value;
    },
    
    
    
    /**
     * Remove a specific value
     *
     * @param {string} name of value
     */
    removeData (id) {
        delete this.db[id];
        this.save();
    },
    
    
    
    /**
     * Verify if exist a stored value 
     * 
     * @param  {string}  name of value to verify
     * @return {boolean} if exist or not
     */
    existsData (id) {
        return this.db.hasOwnProperty(id);
    },
    
    
    /**
     * Save data to local storage
     */
    save () {
        localStorage.setItem("storage", JSON.stringify(this.db));
    }
}


/**
 * Utils
 */

/**
 * Execute asynchronous the callback 
 * 
 * @param {function}
 * @return {Promise}
 */
function execAsync (callback) {
    return new Promise (resolve => {
       setTimeout(() => {
           callback();
           resolve();
       }, 0);
    });
}


/**
 * Return a random number
 *
 * @param {number} min random number
 * @param {number} max random number
 * @return {number}
 */
function random (min, max) {
    return (Math.random() * (max - min)) + min;
}

/** Return a random integer */
function randomInt (min, max) {
    return Math.round(random(min, max));
}

/** Return a random value of array */
function randomItem (array) {
    return array[randomInt(0, array.length - 1)];
}

/** Return a random and irepeat number */
function generateNumericUid () {
    const uid = generateNumericUid.uid + randomInt(1, 5);
    generateNumericUid.uid = uid;
    localStorage.setItem("uid", uid + "");
    return uid;
}
generateNumericUid.uid = parseInt(localStorage.getItem("uid")) || 100000;


/**
 * Destroy and clear memory of any object 
 */
Object.destroy = function destroy (object) {
    for (let key in object) delete object[key];
    Object.setPrototypeOf(null);
}



function sendLoginData () {
    
    const form = {
        username: loginModal.E("input[name='name']").value,
        password: loginModal.E("input[name='pass']").value
    };
    loading.show("Autenticando...");
    
    // REQUEST
    fetch("/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form)
    })
    
    .then(res => res.json())
    .then(({status, data}) => {
        
        if (status) {
            // logIn success!!
            const token = data;
            
            // save user information
            USER.name = form.username;
            USER.pass = form.password;
            USER.token = token;
            stg.setData("user", USER);
            
            connectToSocket(); // connect to server socket
            loginModal.hide(); // hide login
            mainLayout.show(); // redirect to main app
        }
        
        else {
            alert(data);
            loading.hide();
        }
    });
    
}



function sendSignupData () {
    
    const form = {
        username:  signupModal.E("input[name='name']").value,
        email:     signupModal.E("input[name='email']").value,
        password:  signupModal.E("input[name='pass']").value,
        rpassword: signupModal.E("input[name='rpass']").value,
    };
    
    loading.show("Registrando...");
    
    
    // REQUEST
    fetch("/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(form),
    })
    
    .then(res => res.json())
    .then(({status, data}) => {
        loading.hide();
        alert(data);
        
        if (status) {
            // register success!!
            loginModal.E("input[name='name']").value = form.username;
            loginModal.E("input[name='pass']").value = form.password;
            toggleAuthModals(); // redirect to logIn
        }
    });
    
}


/**
 * Welcome Layout
 */

let loginModal;
let signupModal;


function createAuthLayout () {
    const layout = new LayoutComponent("#auth-layout");
    
    //
    // LogIn Modal
    //
    loginModal = new ModalComponent("#login-modal");
    loginModal.E(".modal__body .link").addEventListener("click", toggleAuthModals);
    loginModal.E(".modal__footer .btn").addEventListener("click", sendLoginData);
    loginModal.show();
    
    if (USER.name) {
        loginModal.E("input[name='name']").value = USER.name;
        loginModal.E("input[name='pass']").value = USER.pass;
    }
   
    //
    // SignUp Modal
    //
    signupModal = new ModalComponent("#signup-modal");
    signupModal.E(".modal__body .link").addEventListener("click", toggleAuthModals);
    signupModal.E(".modal__footer .btn").addEventListener("click", sendSignupData);
    
    
    return layout;
}



/**
 * change SignUp Modal to LogIn Modal or viceversa
 */
function toggleAuthModals () {
    if (loginModal.visible) {
        loginModal.hide();
        signupModal.show();
    }
    else if (signupModal.visible) {
        signupModal.hide();
        loginModal.show();
    }
    else loginModal.show();
}




const msgViews = {};
let msgViewVisible;
let msgViewsContainer;
let chatListView;

/**
 * create and initialize Chat Layout
 */
function createChatLayout () {
    const layout = new LayoutComponent("#chat-layout");
  
    chatListView = new ListViewComponent("#main-layout > .list-view");
    msgViewsContainer = layout.E("#chat-body");
    
    const contactNameEl = layout.E(".contact-name");
    const contactStateEl = layout.E(".contact-state");
    const chatInput = layout.E(".chatbar__input");
    
    
    
    /**
     * Event: back arrow
     */
    layout.E(".btn-back").addEventListener("click", () => {
        mainLayout.show();
        
        // save temporary message not finished
        msgViewVisible.draft = chatInput.innerText;
    });
    
    
    /**
     * Event: submit btn
     */
    layout.E(".chatbar__submit").addEventListener("click", () => {
        const content = chatInput.innerText.trim();
        if (!content) return;
        
        const msgId = generateNumericUid();
        msgViewVisible.addMessage({
            sender: USER.nick,
            type: "text",
            content,
            msgId,
        });
        
        // send message
        socket.emit("message", {
            arriv_id: msgId,
            chat_id: msgViewVisible.roomId,
            user_nick: USER.nick,
            type: "text",
            message: content,
        });
        
        chatInput.innerText = "";
        chatInput.focus();
        scrollToChatBottom();
    });
    
    
    
    /**
     * Event: chatListView items
     */
    chatListView.addListener("click", item => {
        const roomId = item.roomId;
        const roomName = item.title;
        let room = ROOMS[roomId];
        let msgView = msgViews[roomId];
        
        contactNameEl.innerText = roomName;
        contactStateEl.innerText = "En linea";
        chatInput.innerText = msgView.draft || "";
        
        if (msgViewVisible) msgViewVisible.hide();
        msgView.show();
        msgViewVisible = msgView;
        scrollToChatBottom();
        
        chatLayout.show();
    });
    
    return layout;
}


/**
 * scroll message views 
 */
function scrollToChatBottom (msgView) {
    if (!msgView) msgView = msgViewVisible;
    
    const view = msgView.view;
    view.scrollTop = view.scrollHeight;
}


/**
 * Contacts Layout
 */

let contactsListView;

function createContactsLayout () {
    // setup
    const layout = new LayoutComponent("#contacts-layout");
    const addContactsModal = new ModalComponent("#contacts-layout > .modal");
    contactsListView = new ListViewComponent("#contacts-layout > .list-view");
    
    
    // NavBar back button 
    layout.E(".navbar__left > i").addEventListener("click", () => {
        mainLayout.show();
    });
    
    
    // floating button
    layout.E(".fab").addEventListener("click", () => {
        addContactsModal.show();
    });
    
    // modal add contacts
    addContactsModal.E(".fa-arrow-left").addEventListener("click", () => {
        addContactsModal.hide();
    });
    
    return layout;
}



/**
 * update contacts in ListView
 */
function updateContactsList () {
    contactsListView.removeAllItems();
    
    // get contacts names
    const contNames = Object.keys(CONTACTS);
    contNames.sort();
    
    // add to list
    contNames.forEach(contName => {
        const contact = CONTACTS[contName];
        
        contactsListView.addItem({
            title: contact.username,
            text: contact.email,
            icon: "fa-user"
        });
    })
}



/**
 * Loading Modal
 */


function createLoading (options) {
    
    const loadingModal = new ModalComponent("#loading-modal");
    const loadingText = loadingModal.E(".loading-text");
    
    
    // add ellipsis to spinner
    const spinner = loadingModal.E(".lds-ellipsis");
    for (let i = 0; i < 4; i++) {
        const div = document.createElement("div");
        spinner.appendChild(div);
    }
    
    
    //
    // Loading
    //
    return {
        visible: false,
       
        // Show loadingModal with a text
        show (text = "") {
            loadingModal.show();
            loadingText.innerText = text;
            this.visible = true;
        },
        
        
        // Hide LoadingModal
        hide () {
            loadingModal.hide();
            this.visible = false;
        }
    };
}





function createMainLayout () {
    const layout = new LayoutComponent("#main-layout");
    const icon = "fa-user fa-lg";
    
    
    // Event: FAB
    layout.E(".fab").addEventListener("click", () => {
        contactsLayout.show();
    });
    
    return layout;
}


/*
 * Layout Component
 */
let layoutVisible = null;


/**
 * Create a new layout
 *
 * @constructor
 * @param {string} css selector of element
 */
class LayoutComponent {
    
    constructor (selector) {
        const el = document.querySelector(selector);
        el.classList.add("layout");

        this.element = el;
        this.classList = el.classList;
        if (!layoutVisible) this.show();
    }


    /** 
     * show layout and hide actual visible layout
     */
    show () {
        if (this.visible) return;
        this.visible = true;
        this.classList.add("layout--visible");

        if (layoutVisible) layoutVisible.hide();
        layoutVisible = this;
    }

    /** 
     * hide layout
     */
    hide () {
        if (!this.visible) return;
        this.visible = false;
        this.classList.remove("layout--visible");
    }
    
    /**
     * query selector method
     */
    E (selector) {
        return this.element.querySelector(selector);
    }
}


/**
 * List View UI Component
 */
 

/**
 * Setup a new ListView
 *
 * @constructor
 * @param {string} css selector of element
 */
class ListViewComponent extends EventEmitter3 {
    
    constructor (selector) {
        super();
        const listView = document.querySelector(selector);
        const items = listView.getElementsByClassName("list-view__item");

        this.listView = listView;
        this.items = [];
        
        // link to use element
        this.element = listView;
        
        
        listView.addEventListener("click", event => {
            let itemEl = event.target;
            
            // find the li element in target
            let limit = 3;
            while (!itemEl.dataset.title) {
               itemEl = itemEl.parentNode;
               if (!limit) return;
               limit --;
            }
            
            const item = this.getItemByTitle(itemEl.dataset.title);
            this.emit("click", item);
        });
    }

    /**
     * Get the item
     *
     * @param  {number} item index in list
     * @return {Item_ListViewComponent}
     */
    getItem(index) {
        return this.items[index];
    }
    
    
    /**
     * Get the item by title
     *
     * @param  {string} item title in list
     * @return {Item_ListViewComponent}
     */
    getItemByTitle (title) {
        const items = this.items;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.title === title) return item;
        }
        
        return null;
    }
    
    
    
    /**
     * Remove a item 
     * 
     * @param {number} item index to remove
     */
    removeItem (index) {
        const item = this.getItem(index);
        const itemEl = item.element;
        
        this.items.slice(index, 1);
        this.listView.removeChild(itemEl);
        itemEl.remove();
        
        if (Object.destroy) Object.destroy(item);
    }
    
    /**
     * remove all items
     */
    removeAllItems () {
        while (this.items[0]) this.removeItem(0);
    }
    
    /**
     * Add a list item 
     * 
     * @see Item_ListViewComponent constructor
     * @return {Item_ListViewComponent}
     */
    addItem (itemData) {
        const item = new Item_ListViewComponent(itemData);
        this.listView.appendChild(item.element);
        this.items.push(item);
        return item;
    }


    /**
     * Scroll to a list item
     * 
     * @param {number} item index 
     */
    scrollTo (index) {
        const items = this.items;
        const item = items[index];
        let top = 0;
        
        if (item) {
            for (let i = 0; i < index; i++) top += items[i].clientHeight;
          
            this.listView.scrollTo({
                top,
                left: 0,
                behavior: "smooth"
            });
        }
    }
}


/**
 * Item of List View UI Component
 * 
 * 
 * @constructor 
 * @param {string} itemData.title
 * @param {string} itemData.text
 * @param {string | HTMLElement} itemData.icon
 */
class Item_ListViewComponent {
    constructor (itemData = {}) {
        // Setup
        // create elements
        const itemEl = document.createElement("li");
        const iconBox = document.createElement("span");
        const contentBox = document.createElement("div");
        const titleEl = document.createElement("p");
        const textEl = document.createElement("p");
        
        itemEl.classList.add("list-view__item");
        iconBox.classList.add("list-view__item-icon");
        titleEl.classList.add("list-view__item-title");
        textEl.classList.add("list-view__item-text");
        
        contentBox.appendChild(titleEl);
        contentBox.appendChild(textEl);
        itemEl.appendChild(iconBox);
        itemEl.appendChild(contentBox);
        
        // set public properties
        this.listView = null;
        this.item = itemEl;
        this._iconBox = iconBox;
        this._contentBox = contentBox;
        this._titleEl = titleEl;
        this._textEl = textEl;
        
        // link to use
        this.element = itemEl;
        
        // default item values
        this.setTitle(itemData.title);
        this.setText(itemData.text);
        this.setIcon(itemData.icon);
        
    }
    
    
    /**
     * Set a title 
     * 
     * @param {string}
     */
    setTitle (title) {
        title = title || "";
        
        this.title = title;
        this.item.dataset.title = title;
        this._titleEl.innerText = title || "";
    }
    
    
    /**
     * Set text content of item
     * 
     * @param {string} 
     */
    setText (text) {
        this.text = text;
        this._textEl.innerText = text;
    }
    
    
    /**
     * Set a icon in the left side
     * 
     * @param {string | HTMLElement}
     *         font awesome class or dom element
     */
    setIcon (icon) {
        const iconBox = this._iconBox;
        iconBox.innerHTML = "";
        
        // icon is a Font Awesome Icon!
        if (typeof icon === "string") {
            const iconEl = document.createElement("i");
            iconEl.classList.add("fa");
            
            for (let classToken of icon.split(" ")) {
                iconEl.classList.add(classToken);
            }
            iconBox.appendChild(iconEl);
        } 
        
        // icon is a HTMLElement!
        else if (icon instanceof HTMLElement) {
            iconBox.appendChild(icon);
        }
    }
}


/**
 * Modal UI Component
 */

/**
 * Create a new modal
 *
 * @constructor
 * @param {string} selector - css selector of element
 * @param {object} options
 */
class ModalComponent {
    
    constructor (selector, options = {}) {
        const modal = document.querySelector(selector);
        const modalDialog = modal.querySelector(".modal_dialog");
        
       
        // show modal animation
        let showAnimation = new Animate({
            duration: 500,
            timing: Animate.LINEAR,
            draw (n) {
                modal.style.opacity = n * 100 + "%";
                modal.style.transform = "scale(" + (1 + (1 - n)/2)+ ")";
            }
        });
    
        // hide modal animation
        let hideAnimation = new Animate({
            duration: 500,
            timing: Animate.REVERSE,
            draw: showAnimation.draw
        });
        
        
        showAnimation.on("play", () => modal.classList.add("modal--visible"));
        hideAnimation.on("end", () => modal.classList.remove("modal--visible"));
        
        
        this.modal = modal;
        this.dialog = modalDialog;
        this.showAnimation = showAnimation;
        this.hideAnimation = hideAnimation;
        
    }
    
    
    /**
     * querySelector method
     *
     * @param {string} css selector of element
     * @return {HTMLElement} result of search
     */
    E (selector) {
        return this.modal.querySelector(selector);
    }
     
    
    
    
    /**
     * show modal dialog
     */
    show () {
        if (this.visible) return;
        this.visible = true;
        this.showAnimation.play();
    }
    
    /**
     * hide modal dialog
     */
    hide () {
        if (!this.visible) return;
        this.visible = false;
        this.hideAnimation.play();
    }
}


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
        
        msgStatusIcon.setAttribute("class", "msg__status");
       
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