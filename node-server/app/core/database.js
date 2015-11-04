var mongojs = require('mongojs')
    , fs = require('fs')
    , utils = require('../services/utils')
    , models_path = process.cwd() + '/app/models'

var db = mongojs('mongodb://admin:admin123@ds045694.mongolab.com:45694/carleton-sesq',
                 ['content'],
                 {authMechanism: 'ScramSHA1'});

var geoDB = mongojs('mongodb://admin:admin123@ds045694.mongolab.com:45694/carleton-sesq',
                    ['geofences'],
                    {authMechanism: 'ScramSHA1'});

module.exports = {
    db : db,
    geoDB : geoDB
}
