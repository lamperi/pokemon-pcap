// Decodes pkx files 
var fs = require('fs')
var Buffer = require('buffer').Buffer
var constants = require('constants')
var veekun = require('./veekun')
var async = require('async')

function range(start, stop, step) {
    if (!step) step = 1;
    var a = [];
    for (var i = start; i < stop; i+=step) {
        a.push(i);
    }
    return a;
}

function PkxDecoder() {

}

PkxDecoder.prototype.decodeFile = function(file, callback) {
    var buffer = fs.readFileSync(file);
    return this.decode(buffer, callback)
}

PkxDecoder.prototype.decode = function(buffer, callback) {
    var dex_id = buffer.readUInt16LE(0x08)
    var name = this.getString(buffer.slice(0x40, 0x58))
    var ot_name = this.getString(buffer.slice(0xB0, 0xC8))
    var ot_id = buffer.readUInt16LE(0x0C)
    var ot_secret_id = buffer.readUInt16LE(0x0E)
    var iv_eggs = buffer.readUInt32LE(0x74)
    var ivs = range(0, 30, 5).map(function(shift) {
        return (iv_eggs >> shift) & 0x1F
    }) 

    var pokemon = {
        dex_id: dex_id,
        item_id: buffer.readUInt16LE(0x0A),
        name: name,
        experience: buffer.readUInt32LE(0x10),
        ability: buffer[0x14],
        ability_number: buffer[0x15],
        personality_value: buffer.readUInt32LE(0x18),
        nature: buffer.readUInt8(0x1C),
        fateful_encounter: !!(buffer.readUInt8(0x1D) & 1),
        female: !!(buffer.readUInt8(0x1D) & 2),
        genderless: !!(buffer.readUInt8(0x1D) & 4),
        forme_id: (buffer.readUInt8(0x1D) >> 3),
        ot: {
            name: ot_name,
            id: ot_id,
            secret_id: ot_secret_id,
            current_ot: this.getString(buffer.slice(0x78, 0x90))
        },
        evs: range(0x1E, 0x24).map(buffer.readUInt8.bind(buffer)),
        pokerus: !!buffer.readUInt8(0x2B),
        ivs: ivs,
        is_egg: iv_eggs & (1 << 30),
        is_nicknamed: iv_eggs & (1 << 31),
        origin: {
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
    async.parallel({
        item: function(cb) {
            veekun.item(pokemon.item_id, cb)
        },
        ability: function(cb) {
            veekun.ability(pokemon.ability, cb)
        }
    }, function(err, results) {
        pokemon.item_name = results.item && results.item.name
        pokemon.ability_name = results.ability && results.ability.name
        callback(err, pokemon)
    })
}

PkxDecoder.prototype.getDate = function(buffer) {
    return "20" + buffer[0] + "-" + buffer[1] + "-" + buffer[2]
}

PkxDecoder.prototype.getString = function(buffer) {
    var i = buffer.length - 1;
    while (i >= 0 && buffer[i] == 0) --i;
    return buffer.toString('utf16le', 0, i+2)
}


exports.PkxDecoder = PkxDecoder
