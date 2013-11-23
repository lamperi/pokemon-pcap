var fs = require('fs')

fs.readdirSync('test/raw-data/').filter(function(file) {
    return file.substring(0,6) == "packet" 
}).forEach(function(file,i) {
    
    var buf = fs.readFileSync('test/raw-data/' + file)
    //var poke = buf.slice(0x003D, 0x0124 + 1)
    //var poke = buf.slice(0x0067, 0x014E + 1)
    var poke = buf.slice(0x0069, 0x0151)
    fs.writeFileSync('poke' + (1+i) + '.bin', poke)
})
