/**
 * Utils
 */


/**
 * loop parent elements recursively 
 * 
 * @param {HTMLElement} element 
 * @param {function} evaluate - function to compare and return boolean if find 
 * @param {number} limit (optional) - limit of calls
 */
function findParentElement (element, evaluate, limit = 3) {
    if (!element) return null;
    
    const parent = element.parentNode;
    if (parent) {
        if (evaluate(parent)) return parent;
        else if (limit) return findParentElement(parent, evaluate, limit - 1);
    }
    
    return null;
}



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
