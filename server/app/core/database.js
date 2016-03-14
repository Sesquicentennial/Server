var mysql = require('mysql'),
    config = require('../../config'),
    config_re = require('../../config_re');

var connection = mysql.createConnection(config);
var connectionPool = mysql.createPool(config_re.mysql);


connection.connect();

module.exports = {
	connection: connection,
	pool: connectionPool
}
