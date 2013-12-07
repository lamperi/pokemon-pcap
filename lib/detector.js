var EventEmitter = require('events').EventEmitter,
    util = require('util')

function Detector() {

}

util.inherits(Detector, EventEmitter)


Detector.prototype.testPacket = function(buffer, data) {
    var pokeStart, pokemon
    data = data || {}
    if (buffer.length > 886) {
        console.log('detector: possible wonder_trade packet')
        pokeStart = buffer.length - 886
        pokemon = buffer.slice(pokeStart, pokeStart+232)
        data.packet_type = 'wonder_trade'
        this.emit('encrypted_pkx', pokemon, data)
    } else if (buffer.length > 260 && buffer.length < 400) {
        console.log('detector: possible trade_show packet')
        pokeStart = buffer.length - 260
        pokemon = buffer.slice(pokeStart, pokeStart+232)
        data.packet_type = 'trade_show'
        this.emit('encrypted_pkx', pokemon, data)
    }
}

exports.Detector = Detector
