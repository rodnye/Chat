/**
 * Utils
 */

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

/** Return a random and irepeat string */
function createUid () {
    createUid.uid += randomInt(1, 5);
    return "uid~" + createUid.uid;
}
createUid.uid = randomInt(1000, 5000);


/**
 * Destroy and clear memory of any object 
 */
Object.destroy = function destroy (object) {
    for (let key in object) delete object[key];
    Object.setPrototypeOf(null);
}