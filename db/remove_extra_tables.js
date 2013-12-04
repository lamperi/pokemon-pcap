// Find Veekun database, and drop all tables we do not need.
//
// You can find a fresh copy of the SQLite database at
// http://veekun.com/static/pokedex/downloads/veekun-pokedex.sqlite.gz

var sqlite3 = require('sqlite3').verbose()

var db = new sqlite3.Database( __dirname + '/pokedex.sqlite' ) 

var SKIP_TABLES = "item_game_indices item_names ability_names move_names pokemon_species experience location_names location_game_indices  pokemon_species_names pokemon_form_generations pokemon_forms pokemon_form_names".split(/\W+/)

function findDependencies(sql) {
    var i = 0
    var dependencies = []
    while (i != -1) {
        i = sql.indexOf("REFERENCES", i)
        if (i != -1) {
            var endI = sql.indexOf(" ", i + 11)
            var subStr = sql.substring(i + 11, endI)
            dependencies.push(subStr)
            i = endI
        }
    }
    return dependencies
}

function isDependency(table1, table2, allDependencies, visited) {
    if (!visited) {
        visited = {}
    }
    var tables = allDependencies[table1] 
    if (!tables) return false
    for (var i = 0; i < tables.length; ++i) {
        if (tables[i] == table2) {
            return true
        }
        if (!visited[tables[i]]) {
            visited[tables[i]] = true
            if (isDependency(tables[i], table2, allDependencies), visited) {
                return true
            }
        }
    }
    return false
}

function saveTables(tables, allDependencies, savedTables) {
    if (!tables) return
    for (var i = 0; i < tables.length; ++i) {
        var name = tables[i]
        if (!savedTables[name]) {
            savedTables[name] = true
            saveTables(allDependencies[name], allDependencies, savedTables)
        }
    }
}

db.serialize(function() {
    var allDependencies = {}
    db.each("SELECT * FROM sqlite_master WHERE type='table'", function(err, row) {
        // We get all the tables from the query and their SQL schema
        // Find any dependencies to build a graph of dependencies
        var name = row.name
        var dependencies = findDependencies(row.sql) 
        allDependencies[name] = dependencies 
    }, function(err) {
        var savedTables = {}
        var removeTables = []
        // We need to save all tables we are directly referencing, 
        // and all the tables they are referencing recursively
        saveTables(SKIP_TABLES, allDependencies, savedTables)
        // Any tables not directly referenced by the needed tables
        // should be removed
        for (var table in allDependencies) {
            if (!savedTables[table]) {
                removeTables.push(table)
            }
        }
        // We need to work out the removing order by finding
        // which tables depend on others
        removeTables.sort(function(tbl1, tbl2) {
            var isDep1 = isDependency(tbl1, tbl2, allDependencies) + 0
            var isDep2 = isDependency(tbl2, tbl1, allDependencies) + 0
            return isDep2 - isDep1
        })
        // Drop all the tables and then run VACUUM to compress the file
        for (var i = 0; i < removeTables.length; ++i) {
            db.run("DROP TABLE " + removeTables[i])
        }
        db.run("VACUUM")
    })
})

