var mysql = require('mysql'),
    config = require('../../config');

var connection = mysql.createConnection(config);

connection.connect();

module.exports = {
	connection: connection
}
