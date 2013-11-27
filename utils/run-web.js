var PokemonWeb = require('../lib/web').PokemonWeb,
    fs = require('fs')
require('./write-json')

var pokemonWeb = new PokemonWeb(5008, '0.0.0.0')

var i = 0
var dir = __dirname + '/pokemon/'
function sendNext() {
    var files = fs.readdirSync(dir)
    var file = files[i++ % files.length]
    
    var poke = JSON.parse(fs.readFileSync(dir + file))
    pokemonWeb.publishPkx(poke)
}

setInterval(sendNext, 5000)
