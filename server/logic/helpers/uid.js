/*A simple module for generate random alpha-numerical ids*/

class uid {
    constructor() {
        this.alphabetical = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.numerical = "0123456789";
        this.characters = this.alphabetical + this.numerical;
    }

    //returns an aplhanumerical random string
    alphanum(longitude) {
        let generated = "";
        for (let x = 0; x < longitude; x++) {
            generated += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        }
        return generated;
    }

    //returns an alphabetical random string
    alpha(longitude) {
        let generated = "";
        for (let x = 0; x < longitude; x++) {
            generated += this.alphabetical.charAt(Math.floor(Math.random() * this.alphabetical.length));
        }
        return generated;
    }

    //returns a numerical random string
    num(longitude) {
        let generated = "";
        for (let x = 0; x < longitude; x++) {
            generated += this.numerical.charAt(Math.floor(Math.random() * this.numerical.length));
        }
        return generated;
    }


}

module.exports = new uid();