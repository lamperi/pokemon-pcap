var fs = require("fs")
var file = __dirname + "/../db/pokedex.sqlite"

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file, function(err, status) {
    if (err) {
        console.log(err)
        process.exit(1)
    }
});
console.log(db)

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
    // Note: these are not yet in the database
    var natures = [
        "Hardy", "Lonely", "Brave", "Adamant", "Naughty",
        "Bold", "Docile", "Relaxed", "Impish", "Lax",
        "Timid", "Hasty", "Serious", "Jolly", "Naive",
        "Modest", "Mild", "Quiet", "Bashful", "Rash",
        "Calm", "Gentle", "Sassy", "Careful", "Quirkly"
    ]
    var nature_name = natures[nature_id]
    callback(null, {"name": nature_name})
}

exports.location = function(location_id, gen, callback) {
    db.serialize(function() {
        db.get("select ln.name from location_names ln, location_game_indices lgi where lgi.generation_id = ? and lgi.game_index = ? and ln.location_id = lgi.location_id and ln.local_language_id = 9", gen, location_id, callback)
    })
}


exports.species = function(dex_id, callback) {
    db.serialize(function() {
        db.get("select psn.name from pokemon_species_names psn where psn.pokemon_species_id = ? and psn.local_language_id = 9", dex_id, callback)
    })
}
exports.form = function(dex_id, form_id, callback) {
    db.serialize(function() {
        db.get("select pfn.pokemon_name as form_name from pokemon_form_generations pfg, pokemon_forms pf, pokemon_form_names pfn where pfg.game_index = ? and pfg.generation_id = 5 and pf.pokemon_id = ? and pfg.pokemon_form_id = pf.id and pf.id = pfn.pokemon_form_id and pfn.local_language_id = 9", form_id, dex_id, callback)
    })
}

exports.pokeball = function(pokeball_id, callback) {
    // Note: these are not yet in the database
    var balls = {
        2: "Ultra Ball",
        3: "Great Ball",
        4: "Poké Ball",
        6: "Net Ball",
        7: "Dive Ball",
        9: "Repeat Ball",
        10: "Timer Ball",
        11: "Luxury Ball",
        12: "Premier Ball",
        13: "Dusk Ball",
        14: "Heal Ball",
        15: "Quick Ball"
    }
    var ball_name = balls[pokeball_id] || "Unknown ball"
    callback(null, {"name": ball_name})
}
