// Decodes pkx files 
// Format discovered by Xkf and Bond697
var fs = require('fs')
var pokemonData = require('./pokemon-data')
var async = require('async'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter

function range(start, stop, step) {
    if (!step) step = 1
    var a = []
    for (var i = start; i < stop; i+=step) {
        a.push(i)
    }
    return a
}

function PkxDecoder() {

}
util.inherits(PkxDecoder, EventEmitter)

PkxDecoder.prototype.decodeFile = function(file, callback, data) {
    var buffer = fs.readFileSync(file)
    return this.decode(buffer, callback, data)
}

PkxDecoder.prototype.decode = function(buffer) {
    var callback, data
    if (typeof arguments[1] == 'function') {
        callback = arguments[1]
        data = arguments[2]
    } else {
        callback = null
        data = arguments[1]
    }

    var dex_id = buffer.readUInt16LE(0x08)
    var name = this.getString(buffer.slice(0x40, 0x58))
    var ot_name = this.getString(buffer.slice(0xB0, 0xC8))
    var ot_id = buffer.readUInt16LE(0x0C)
    var ot_secret_id = buffer.readUInt16LE(0x0E)
    var iv_eggs = buffer.readUInt32LE(0x74)
    var ivs = range(0, 30, 5).map(function(shift) {
        return (iv_eggs >> shift) & 0x1F
    }) 

    var emit = this.emit.bind(this)
    var gen = 6 // XXX
    var pokemon = {
        dex_id: dex_id,
        item_id: buffer.readUInt16LE(0x0A),
        name: name,
        experience: buffer.readUInt32LE(0x10),
        level: 0,
        ability: buffer[0x14],
        ability_number: buffer[0x15],
        personality_value: buffer.readUInt32LE(0x18),
        shiny_value: null,
        nature: buffer.readUInt8(0x1C),
        nature_name: null,
        fateful_encounter: !!(buffer.readUInt8(0x1D) & 1),
        female: !!(buffer.readUInt8(0x1D) & 2),
        genderless: !!(buffer.readUInt8(0x1D) & 4),
        forme_id: (buffer.readUInt8(0x1D) >> 3),
        evs: range(0x1E, 0x24).map(buffer.readUInt8.bind(buffer)),
        ivs: ivs,
        moves: {
            ids: range(0x5A, 0x62, 2).map(buffer.readUInt16LE.bind(buffer)),
            pp: range(0x62, 0x66).map(buffer.readUInt8.bind(buffer)),
            pp_ups: range(0x66, 0x6A).map(buffer.readUInt8.bind(buffer)),
            egg_ids: range(0x6A, 0x71, 2).map(buffer.readUInt16LE.bind(buffer))
        },
        pokerus: !!buffer.readUInt8(0x2B),
        is_egg: !!(iv_eggs & (1 << 30)),
        is_nicknamed: !!(iv_eggs & (1 << 31)),
        ot: {
            name: ot_name,
            id: ot_id,
            secret_id: ot_secret_id
        },
        origin: {
            current_ot: this.getString(buffer.slice(0x78, 0x90)),
            date_egg_received: this.getDate(buffer.slice(0xD1,0xD4)),
            date_egg_hatched: this.getDate(buffer.slice(0xD4,0xD7)),
            egg_location: buffer.readUInt16LE(0xD8),
            met_location: buffer.readUInt16LE(0xDA),
            pokeball: buffer.readUInt8(0xDC),
            game_version: buffer.readUInt8(0xDF),
            country_id: buffer.readUInt8(0xE0),
            region_id: buffer.readUInt8(0xE1),
            '3ds_region_id': buffer.readUInt8(0xE2),
            ot_language: buffer.readUInt8(0xE3)
        }
    }
    pokemon.ot.shiny_value = (pokemon.ot.id ^ pokemon.ot.secret_id) >> 4
    pokemon.shiny_value = (buffer.readUInt16LE(0x18) ^ buffer.readUInt16LE(0x1A)) >> 4
    pokemon.gender_name = (pokemon.genderless? "Genderless" : pokemon.female? "Female" : "Male")
    async.parallel({
        item: function(cb) {
            pokemonData.item(pokemon.item_id, cb)
        },
        ability: function(cb) {
            pokemonData.ability(pokemon.ability, cb)
        },
        level: function(cb) {
            pokemonData.level(pokemon.dex_id, pokemon.experience, cb)
        },
        nature: function(cb) {
            pokemonData.nature(pokemon.nature, cb)
        },
        move_names: function(cb) {
            async.parallel(pokemon.moves.ids.map(function(move_id) {
                return function(cb) {
                    pokemonData.move(move_id, cb)
                }
            }), function(err, results) {
                cb(err, results)
            })
        },
        egg_move_names: function(cb) {
            async.parallel(pokemon.moves.egg_ids.map(function(move_id) {
                return function(cb) {
                    pokemonData.move(move_id, cb)
                }
            }), function(err, results) {
                cb(err, results)
            })
        },
        met_location: function(cb) {
            pokemonData.location(pokemon.origin.met_location, gen, cb)
        },
        egg_location: function(cb) {
            pokemonData.location(pokemon.origin.egg_location, gen, cb)
        },
        pokeball: function(cb) {
            pokemonData.pokeball(pokemon.origin.pokeball, cb)
        },
        species: function(cb) {
            pokemonData.species(pokemon.dex_id, cb)
        },
        form: function(cb) {
            pokemonData.form(pokemon.dex_id, pokemon.forme_id, cb)
        }
    }, function(err, results) {
        if (err) {
            emit('error', err, data)
        } else {
            pokemon.item_name = results.item && results.item.name
            pokemon.level = results.level && results.level.level
            pokemon.ability_name = results.ability && results.ability.name
            pokemon.nature_name = results.nature && results.nature.name
            pokemon.moves.names = results.move_names.map(function(o) {
                return o && o.name   
            })
            pokemon.moves.egg_names = results.egg_move_names.map(function(o) {
                return o && o.name   
            })
            pokemon.origin.met_location_name = results.met_location && results.met_location.name
            pokemon.origin.egg_location_name = results.egg_location && results.egg_location.name
            pokemon.origin.pokeball_name = results.pokeball.name
            pokemon.species = results.species && results.species.name
            pokemon.form = results.form && results.form.name

            if (pokemon.origin.current_ot.length === 0) {
                pokemon.origin.current_ot = pokemon.ot.name
            }
            emit('pokemon', pokemon, data)
        }
        if (callback) {
            callback(err, pokemon, data)
        }
    })
}

PkxDecoder.prototype.getDate = function(buffer) {
    function p(i) { return i < 10 ? "0" + i : i }
    return "20" + p(buffer[0]) + "-" + p(buffer[1]) + "-" + p(buffer[2])
}

PkxDecoder.prototype.getString = function(buffer) {
    var i = 0
    while (i+1 < buffer.length && buffer[i] !== 0) i+=2;
    return buffer.toString('utf16le', 0, i)
}


exports.PkxDecoder = PkxDecoder
