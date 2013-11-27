var express = require('express'),
    exphbs  = require('express3-handlebars'),
    socketIo = require('socket.io'),
    helpers = require('../shared/helpers.js')

function PokemonWeb(port, ip) {
    this.port = port
    this.ip = ip
    this.pokemons=[]
    this.init()
}

PokemonWeb.prototype.init = function() {
    this.app = express()
    this.hbs = exphbs.create({
        helpers: helpers,
        defaultLayout: 'main',
        partialsDir: ['shared/templates/', 'views/partials'],
    })
    this.app.engine('handlebars', this.hbs.engine) 
    this.app.set('view engine', 'handlebars')
    this.app.use(express.static(__dirname + '/../public'))
    this.app.use(express.static(__dirname + '/../shared'))
    this.app.use(express.logger())
    this.io = socketIo.listen(this.app.listen(this.port, this.ip))

    process.on('SIGTERM', this.close.bind(this))

    var config_js = "var config = {port: " + this.port + "}"

    var pokemons = this.pokemons
    this.app.get('/', function(request, response) {

        response.render('index', {
            left_pokemon: pokemons[0],
            right_pokemon: pokemons[1]
        }) 
    })
    this.app.get('/config.js', function(request, response) {
        response.setHeader('Content-Type', 'application/javascript')
        response.send(config_js)
    })
}

PokemonWeb.prototype.publishPkx = function(pokemon) {
    this.pokemons.unshift(pokemon)
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
