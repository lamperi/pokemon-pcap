var http = require('http'),
    socketIo = require('socket.io'),
    util = require('util'),
    static = require('node-static')

function PokemonWeb(port, ip) {
    this.port = port
    this.ip = ip
    this.init()
}

PokemonWeb.prototype.init = function() {
    this.server = http.createServer()
    this.io = socketIo.listen(this.server)
    this.server.listen(this.ip, this.port)
    this.server.on('request', this.handleRequest.bind(this))
    this.staticServer = new static.Server('./public')
}

PokemonWeb.prototype.handleRequest = function(request, response) {
    var staticServer = this.staticServer
    if (request.url == "/config.js") {
        response.writeHead(200, {'Content-Type': 'application/javascript'})
        response.end("var config = {port: " + this.port + "}")
    }
    request.on('end', function() {
        staticServer.serve(request, response).addListener(function(err) {
            sys.error("Error serving " + request.url + " - " + err.message)
        })
    })
}

PokemonWeb.prototype.publishPkx = function(pokemon) {
    this.io.sockets.emit('pokemon', {data: pokemon})
}

exports.PokemonWeb = PokemonWeb
