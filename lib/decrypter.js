var EventEmitter = require('events').EventEmitter,
    util = require('util')

var xycrypt = require('./xycrypt')
//var xycrypt = require('../build/Release/xycrypt')

function Decrypter() {

}

util.inherits(Decrypter, EventEmitter)

Decrypter.prototype.decrypt = function(buffer, data) {
    var out = null, error
    data = data || {}
    try {
        out = xycrypt.decrypt(buffer)
    } catch (e) {
        error = e 
    }
    if (out) {
        data.pkx = out 
        this.emit('pkx', out, data)
    } else {
        this.emit('pkx_failed', error, data)
    }
}

exports.Decrypter = Decrypter
