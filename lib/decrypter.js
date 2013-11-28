var EventEmitter = require('events').EventEmitter,
    util = require('util'),
    xycrypt = require('../build/Release/xycrypt')

function Decrypter() {

}

util.inherits(Decrypter, EventEmitter)

Decrypter.prototype.decrypt = function(buffer, data) {
    var out = xycrypt.decrypt(buffer)
    if (out && out.length == buffer.length) {
        this.emit('pkx', out, data)
    } else {
        this.emit('pkx_failed', buffer, data)
    }
}

exports.Decrypter = Decrypter
