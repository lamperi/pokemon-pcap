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
        if (e.toString() === "Error: setuid user id does not exist") {
            console.log('setuid() failed - unknown user id ' + config.user)
        } else if (e.toString() === "Error: setgid group id does not exist") {
            console.log('setgid() failed - unknown group id ' + config.group)
        } else if (e && e.code == 'EPERM' && e.errno == 1) {
            console.error('setgid and setuid not permitted - try to run as root')
        } else {
            console.error('setgid and setuid failed')
            console.error(e)
        }
    }
}

function initialize(conf) {
    var pCapturer =  new PCapturer(conf.get('pcap'))
    var pokemonWeb = new PokemonWeb(conf.get('web'), conf.get('3ds'))
    runAs(conf.get('runas'))
    pokemonWeb.init()
    pCapturer.on('pokemon', pokemonWeb.publishPkx.bind(pokemonWeb))
    pCapturer.on('pokemon', function(pokemon, metadata) {
        var fbasename = moment().format('YYYY-MM-DD_HHmm_') + pokemon.species + "_" + pokemon.personality_value
        var dir = path.join(conf.get('data:dir'), metadata.shost == conf.get('3ds:mac') ? 'out' : 'in')
        fs.writeFileSync(path.join(dir, fbasename + '.pkx'), metadata.pkx)
        
        var info = {}
        for (var key in metadata) {
            if (metadata.hasOwnProperty(key) && key != 'pkx') {
                info[key] = metadata[key]
            }
        }
        fs.writeFileSync(path.join(dir, fbasename + '.json'), JSON.stringify(info))
    })
}

exports.initialize = initialize
