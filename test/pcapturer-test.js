var PCapturer = require('../lib/pcapturer').PCapturer,
    sinon = require('sinon'),
    fs = require('fs'),
    assert = require('assert')

describe('PCapturer', function() {
    var config = {get: sinon.stub()}
    config.get.withArgs('interface').returns('')
    config.get.withArgs('filter').returns('')

    var pCapturer = new PCapturer(config)
    afterEach(function() {
        pCapturer.removeAllListeners()
    })

    it('should emit "pokemon" for a good packet', function(once) {
        var packet = fs.readFileSync('test/raw-series/packet176.bin')

        pCapturer.on('pokemon', function(pokemon) {
            assert.equal("Gible", pokemon.name)
            once()
        })
        pCapturer.networkCapturer.emit('udp_packet', packet)
    })

/*
    it('should emit "pokemon" for a good packet, take 2', function(once) {
        var packet = fs.readFileSync('data/udp-packet17.bin')

        pCapturer.on('pokemon', function(pokemon) {
            assert.equal("Gible", pokemon.name)
            once()
        })
        pCapturer.networkCapturer.emit('udp_packet', packet)
    })

    it('should emit "pokemon" for a good packet, take 3', function(once) {
        var packet = fs.readFileSync('data/udp-packet18.bin')

        pCapturer.on('pokemon', function(pokemon) {
            assert.equal("Froakie", pokemon.name)
            once()
        })
        pCapturer.networkCapturer.emit('udp_packet', packet)
    })
    */
})
