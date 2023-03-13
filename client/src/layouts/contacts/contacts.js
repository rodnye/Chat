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
