var EventEmitter = require('events').EventEmitter,
    util = require('util')

function Detector() {

}

util.inherits(Detector, EventEmitter)


Detector.prototype.testPacket = function(buffer) {
    if (buffer.length > 886) {
        var pokeStart = buffer.length - 886
        var pokemon = buffer.slice(pokeStart, pokeStart+232)
        this.emit('encrypted_pkx', pokemon)
    } else if (buffer.length == 321) {
        var pokeStart = 0x3D
        var pokemon = buffer.slice(pokeStart, pokeStart+232)
        this.emit('encrypted_pkx', pokemon)
    }
}

exports.Detector = Detector
