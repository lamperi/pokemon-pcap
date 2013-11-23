var PkxDecoder = require('../lib/decoder').PkxDecoder,
    fs = require('fs')

var fromDir = __dirname + '/../test/data/'
var toDir = __dirname + '/pokemon/'
var decoder = new PkxDecoder()
fs.readdir(fromDir, function(err, files) {
    files.forEach(function(file) {
        decoder.decodeFile(fromDir + file, function(err, pokemon) {
            var name = toDir + file.replace('pkx', 'json')
            fs.writeFileSync(name, JSON.stringify(pokemon))
        })
    })
})
