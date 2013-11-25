var fs = require("fs")
var file = __dirname + "/../db/pokedex.sqlite"

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file, function(err, status) {
    if (err) {
        console.log(err)
        process.exit(1)
    }
});

exports.item = function(item_id, callback) {
    db.serialize(function() {
        db.get("select i.name from item_game_indices ig, item_names i WHERE ig.item_id = i.item_id AND i.local_language_id = 9 AND ig.generation_id = 5 AND ig.game_index = ?", item_id, callback)
    })
}

exports.ability = function(ability_id, callback) {
    db.serialize(function() {
        db.get("select name from ability_names where ability_id = ? and local_language_id = 9", ability_id, callback)
    })
}

exports.move = function(move_id, callback) {
    db.serialize(function() {
        db.get("select name from move_names where move_id = ? and local_language_id = 9", move_id, callback)
    })
}

exports.level = function(dex_id, experience, callback) {
    db.serialize(function() {
        db.get("select max(level) as level from pokemon_species ps, experience e where ps.growth_rate_id = e.growth_rate_id and ps.id = ? and e.experience <= ?", dex_id, experience, callback)
    })
}

exports.nature = function(nature_id, callback) {
    db.serialize(function() {
        db.get("select name from nature_names where nature_id = ? and local_language_id = 9", nature_id, callback)
    })
}

exports.location = function(location_id, gen, callback) {
    db.serialize(function() {
        db.get("select ln.name from location_names ln, location_game_indices lgi where lgi.generation_id = ? and lgi.game_index = ? and ln.location_id = lgi.location_id", gen, location_id, callback)
    })
}

exports.pokeball = function(pokeball_id, callback) {
    // Note: these are not yet in the database
    var balls = {
        2: "Great Ball"
    }
    var ball_name = balls[pokeball_id] || "Unknown ball"
    callback(null, {"name": ball_name})
}
