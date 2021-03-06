var NetworkCapturer = require('./network-capturer').NetworkCapturer,
    Detector = require('./detector').Detector,
    Decrypter = require('./decrypter').Decrypter,
    Decoder = require('./decoder').PkxDecoder,
    util = require('util'),
    EventEmitter = require('events').EventEmitter

function PCapturer(config) {

    this.networkCapturer = new NetworkCapturer(config.interface, config.filter)
    this.detector = new Detector()
    this.decrypter = new Decrypter()
    this.decoder = new Decoder()

    this.networkCapturer.on('udp_packet', this.detector.testPacket.bind(this.detector))
    this.detector.on('encrypted_pkx', this.decrypter.decrypt.bind(this.decrypter))
    this.decrypter.on('pkx', this.decoder.decode.bind(this.decoder))
    this.decrypter.on('pkx', this.onPkx.bind(this))
    this.decoder.on('pokemon', this.onDecodedPokemon.bind(this))

    this.decrypter.on('error', this.onError.bind(this))
    this.decoder.on('error', this.onError.bind(this))

    this.networkCapturer.startSession()
}
util.inherits(PCapturer, EventEmitter)

PCapturer.prototype.onPkx = function(pkx, metadata) {
    this.emit('pkx', pkx, metadata)
}

PCapturer.prototype.onDecodedPokemon = function(pokemon, metadata) {
    this.emit('pokemon', pokemon, metadata)
}

PCapturer.prototype.onError = function(error) {
    this.emit('error', error)
}

exports.PCapturer = PCapturer
