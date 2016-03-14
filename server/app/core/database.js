var mysql = require('mysql'),
    config = require('../../config');

var connectionPool = mysql.createPool(config.mysql);

module.exports = {
	pool: connectionPool
}
