var utils = require('../services/utils'),
    imageHelper = require('../services/images'),
    database = require('../core/database'),
    Q = require('q');

var getQuest = function (req, res, next) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ content: questObject }));
}

module.exports = {
	getQuest: getQuest
}
