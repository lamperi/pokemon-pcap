var EventEmitter = require('events').EventEmitter,
    util = require('util')

function Detector() {

}

util.inherits(Detector, EventEmitter)


Detector.prototype.testPacket = function(buffer, data) {
    var pokeStart, pokemon
    data = data || {}
    if (buffer.length > 886) {
        pokeStart = buffer.length - 886
        pokemon = buffer.slice(pokeStart, pokeStart+232)
        data.packet_type = 'wonder_trade'
        this.emit('encrypted_pkx', pokemon, data)
    } else if (buffer.length == 321) {
        pokeStart = 0x3D
        pokemon = buffer.slice(pokeStart, pokeStart+232)
        data.packet_type = 'trade_show'
        this.emit('encrypted_pkx', pokemon, data)
    }
}

exports.Detector = Detector
