var fs = require('fs'),
    moment = require('moment'),
    path = require('path'),
    PCapturer = require('./pcapturer').PCapturer,
    PokemonWeb = require('./web').PokemonWeb

function runAs(config) {
    try {
        process.setgid(config.group)
        process.setuid(config.user)
    } catch(e) {
        console.log('setgid and setuid not permitted - if we are not running as root we may be unable to capture packets')
    }
}

function initialize(conf) {
    var pCapturer =  new PCapturer(conf.get('pcap'))
    var pokemonWeb = new PokemonWeb(conf.get('web'), conf.get('3ds'))
    runAs(conf.get('runas'))
    pCapturer.on('pokemon', pokemonWeb.publishPkx.bind(pokemonWeb))
    pCapturer.on('pokemon', function(pokemon, metadata) {
        var fbasename = moment().format('yyy-MM-dd_HHmm_') + pokemon.species 
        fs.writeFileSync(path.join(conf.get('data:dir'), fbasename + '.pkx'), metadata.pkx)
        
        var info = {}
        for (var key in metadata) {
            if (metadata.hasOwnProperty(key) && key != 'pkx') {
                info[key] = metadata
            }
        }
        fs.writeFileSync(path.join(conf.get('data:dir'), fbasename + '.json'), JSON.stringify(info))
    })
}

exports.initialize = initialize
