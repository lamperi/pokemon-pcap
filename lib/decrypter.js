var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    xycrypt = require('../build/Release/xycrypt')

function Decrypter() {

}

util.inherits(Decrypter, EventEmitter)

Decrypter.prototype.decrypt = function(buffer, data) {
    var out = xycrypt.decrypt(buffer)
    data = data || {}
    if (out && out.length == buffer.length) {
        data.pkx = out 
        this.emit('pkx', out, data)
    } else {
        this.emit('pkx_failed', buffer, data)
    }
}

exports.Decrypter = Decrypter
