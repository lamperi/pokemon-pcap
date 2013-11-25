var PCapturer = require('../lib/pcapturer').PCapturer,
    fs = require('fs')

var config = {
    'get': function(key) {
        return this[key]
    },
    'interface': '',
    'filter': ''
}

var pCapturer = new PCapturer(config)
var packet = fs.readFileSync(process.argv[2])

pCapturer.on('pokemon', function(pokemon) {
    console.log(pokemon)
})
pCapturer.on('error', function(err) {
    console.log('error happened')
})
pCapturer.networkCapturer.emit('udp_packet', packet)

