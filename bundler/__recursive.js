
const fs = require("fs");
const path = require("path");

function readRecursiveDir (dir) {
    let dirList = [];
    
    fs.readdirSync(dir).forEach(fileName => {
        const fileDir = path.join(dir, fileName);
        
        if (fs.statSync(fileDir).isDirectory()) {
            // is a directory!
            dirList = dirList.concat( readRecursiveDir(fileDir) );
        }
        else {
            // is a file!
            dirList.push(fileDir);
        }
    });
    
    return dirList;
}

module.exports = readRecursiveDir;