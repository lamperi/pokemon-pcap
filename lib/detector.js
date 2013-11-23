var EventEmitter = require('events').EventEmitter,
    util = require('util')

function Detector() {

}

util.inherits(Detector, EventEmitter)


Detector.prototype.testPacket = function(buffer) {
    if (buffer.length === 991) {
        var pokemon = buffer.slice(0x0069, 0x0151)        
        this.emit('encrypted_pkx', pokemon);
    }
}

exports.Detector = Detector
