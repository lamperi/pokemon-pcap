var express = require('express'),
    socketIo = require('socket.io')

function PokemonWeb(port, ip) {
    this.port = port
    this.ip = ip
    this.init()
}

PokemonWeb.prototype.init = function() {
    this.app = express()
    this.app.use(express.static(__dirname + '/../public'))
    this.app.use(express.logger())
    this.io = socketIo.listen(this.app.listen(this.port, this.ip))

    process.on('SIGTERM', this.close.bind(this))

    var config_js = "var config = {port: " + this.port + "}"
    this.app.get('/config.js', function(request, response) {
        response.setHeader('Content-Type', 'application/javascript')
        response.send(config_js)
    })
}

PokemonWeb.prototype.publishPkx = function(pokemon) {
    this.io.sockets.emit('pokemon', {
        pokemon: pokemon,
        type: 'wonder-trade'
    })
}

PokemonWeb.prototype.close = function() {
    this.app.close()
    this.io.server.close()

}

exports.PokemonWeb = PokemonWeb
