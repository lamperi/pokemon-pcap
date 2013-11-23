var nconf = require('nconf')

function runAs(config) {
    process.setgid(config.group)
    process.setuid(config.user)
}

function initialize(conf) {
    var pCapturer =  new PCapturer(conf.get('pcap'))
    var pokemonWeb = new PokemonWeb(conf.get('web'))
    runAs(config.get(conf.get('runas'))
    pCapturer.on('pokemon', pokemonWeb.publishPkx.bind(pokemonWeb))
}

exports.initialize = initialize
