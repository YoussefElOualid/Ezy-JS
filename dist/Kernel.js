"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
var fs = require('fs');
try {
    var data = fs.readFileSync(__dirname + '/assets/banner.txt', 'utf8');
    Logger_1.initLogger(data.toString());
}
catch (e) {
    console.log('Error:', e.stack);
}
//# sourceMappingURL=Kernel.js.map