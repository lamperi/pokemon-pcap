var PokemonWeb = require('../lib/web').PokemonWeb,
    fs = require('fs'),
    nconf = require('nconf')

require('./write-json')

var conf = new nconf.Provider({type: 'literal', store: {
    database: {port: 5008, ip: '0.0.0.0'},
    '3ds': {mac: '00:00:00:00:00:AA'}
    }})
var pokemonWeb = new PokemonWeb(conf.get('database'), conf.get('3ds'))

var i = 0
var dir = __dirname + '/pokemon/'
function sendNext() {
    var files = fs.readdirSync(dir)
    var file = files[i++ % files.length]
    
    var poke = JSON.parse(fs.readFileSync(dir + file))
    var data = {
        shost: Math.random() < 0.5 ? '00:00:00:00:00:AA' : '00:00:00:00:00:BB',
        packet_type: Math.random() < 0.5 ? 'wonder_trade' : 'trade_show'
    }
    pokemonWeb.publishPkx(poke, data)
}

sendNext()
sendNext()
setInterval(sendNext, 5000)
