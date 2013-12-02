var PkxDecoder = require('../lib/decoder').PkxDecoder,
    fs = require('fs')

var fromDir = __dirname + '/../test/data/'
var toDir = __dirname + '/pokemon/'
var decoder = new PkxDecoder()
fs.mkdir(toDir)
fs.readdir(fromDir, function(err, files) {
    files.forEach(function(file) {
        var data = {"fileName": file}
        decoder.decodeFile(fromDir + file, callback, {"fileName": file})
    })
})

function callback(err, pokemon, data) {
    var name = toDir + data.fileName.replace('pkx', 'json')
    fs.writeFileSync(name, JSON.stringify(pokemon))
}
