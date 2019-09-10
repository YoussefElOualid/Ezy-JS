import {initLogger} from "./Logger";
var fs = require('fs');

try {
    var data = fs.readFileSync(__dirname + '/assets/banner.txt', 'utf8');
    initLogger(data.toString());
} catch(e) {
    console.log('Error:', e.stack);
}


