var express = require('express'),
    exphbs  = require('express3-handlebars'),
    socketIo = require('socket.io'),
    helpers = require('../shared/helpers.js'),
    fs = require('fs')

function PokemonWeb(webconf, dsconf) {
    this.port = webconf.port
    this.ip = webconf.ip
    this.leftPokemon=[]
    this.rightPokemon=[]
    this.dsconf = dsconf
    this.initRoot()
}

PokemonWeb.prototype.initRoot = function() {
    this.app = express()
    this.io = socketIo.listen(this.app.listen(this.port, this.ip))
    console.log('Web server listening on ' + this.ip + ':' + this.port)
}

PokemonWeb.prototype.init = function() {
    this.hbs = exphbs.create({
        helpers: helpers,
        defaultLayout: 'main',
        partialsDir: ['shared/templates/', 'views/partials'],
    })
    this.app.engine('handlebars', this.hbs.engine) 
    this.app.set('view engine', 'handlebars')
    this.app.use(express.static(__dirname + '/../public'))
    this.app.use(express.static(__dirname + '/../shared'))
    this.app.use(
            express.logger({stream: fs.createWriteStream(__dirname + '/../logs/web.log', {flags: 'a'})}))
    this.io.set('log level', 1)

    process.on('SIGTERM', this.close.bind(this))

    var config_js = "var config = {port: " + this.port + "}"

    this.loadPokemon()

    var leftPokemon = this.leftPokemon
    var rightPokemon = this.rightPokemon
    this.app.get('/', function(request, response) {

        response.render('index', {
            left_pokemon: leftPokemon[0],
            right_pokemon: rightPokemon[0],
            left_pokemon_list: leftPokemon,
            right_pokemon_list: rightPokemon
        }) 
    })
    this.app.get('/config.js', function(request, response) {
        response.setHeader('Content-Type', 'application/javascript')
        response.send(config_js)
    })
}

PokemonWeb.prototype.publishPkx = function(pokemon, data) {
    var side
    data = data || {}
    console.log('web:publishPxk have saddr mac of ' + data.shost + ' ours is ' + this.dsconf.mac)
    if (data.shost == this.dsconf.mac) {
        side = 'left' 
        this.leftPokemon.unshift(pokemon)
    } else {
        side = 'right'
        this.rightPokemon.unshift(pokemon)
    }
    this.io.sockets.emit('pokemon', {
        pokemon: pokemon,
        side: side,
        type: data.packet_type
    })
}

PokemonWeb.prototype.close = function() {
    this.app.close()
    this.io.server.close()
}

PokemonWeb.prototype.loadPokemon = function() {
    function loadList(list, dir) {
        var fileList = fs.readdirSync(dir)
        fileList.sort()
        fileList.reverse()
        fileList.splice(10)
        var decoder = new Decoder()
        decoder.on('pokemon', function(pokemon) {
            list.push(pokemon)
        })
        for (var i = 0; i < fileList.length; ++i) {
            if (fileList[i].indexOf(".pkx") != -1) {
                decoder.decodeFile(dir + '/' + fileList[i])
            }
        }
    }
    var INDIR = __dirname + '/../data/in'
    var OUTDIR = __dirname + '/../data/out'
    var Decoder = require('./decoder').PkxDecoder
    loadList(this.leftPokemon, OUTDIR)
    loadList(this.rightPokemon, INDIR)
}

exports.PokemonWeb = PokemonWeb
