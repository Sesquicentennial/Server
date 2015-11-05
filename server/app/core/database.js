var mongojs = require('mongojs'),
    fs = require('fs'),
    utils = require('../services/utils');

var infoDB = mongojs('mongodb://admin:admin123@ds045694.mongolab.com:45694/carleton-sesq', ['info'], {
    authMechanism: 'ScramSHA1'
});

var geoDB = mongojs('mongodb://admin:admin123@ds045694.mongolab.com:45694/carleton-sesq', ['geofences'], {
    authMechanism: 'ScramSHA1'
});

module.exports = {
    infoDB: infoDB,
    geoDB: geoDB
}
