// Connection to node.js server
function tryReconnect() {
    if (socket.socket.connected === false && socket.socket.connecting === false) {
        socket.socket.connect()
    }
}
function makePokemonTitle(pokemon) {
    var gender = pokemon.genderless ? '' : pokemon.female ? '(F)' : '(M)'
    return (
        pokemon.species + ' ' + gender + 
        ' - ' + pokemon.nature_name + ', ' + pokemon.ability_name + ', ' + 
        pokemon.ivs[0] + '\\' + pokemon.ivs[1] + '\\' +
        pokemon.ivs[2] + '\\' + pokemon.ivs[4] + '\\' +
        pokemon.ivs[5] + '\\' + pokemon.ivs[3])
}
var pokemonList = []
var intervalID = null
var i = 0
var socket = io.connect(location.protocol + location.hostname + ":" + config.port)
socket.on('pokemon', function(data) {
    var target = data.side + '-pokemon'
    document.getElementById(target).innerHTML = Handlebars.templates.pokemon(data.pokemon)

    var select = document.getElementById(data.side + '-list')
    var option = new Option(Handlebars.templates.pokemonTitle(data.pokemon), JSON.stringify(data.pokemon), false, false)
    option.selected = true
    select.insertBefore(option, select.firstChild)
})
socket.on('disconnect', function() {
    intervalID = setInterval(tryReconnect, 2000)
    document.getElementById('connected').style.display = 'none'
    document.getElementById('disconnected').style.display = 'inline-block'
})
socket.on('connect', function() {
    if (intervalID !== null) {
        clearInterval(intervalID)
        intervalID = null
    }
    document.getElementById('connected').style.display = 'inline-block'
    document.getElementById('disconnected').style.display = 'none'
})

document.getElementById("left-list").onchange = onPokemonChange
document.getElementById("right-list").onchange = onPokemonChange
function onPokemonChange() {
    var value = this.options[this.selectedIndex].value
    var target = document.getElementById(this.id.replace("list", "pokemon"))
    target.innerHTML = Handlebars.templates.pokemon(JSON.parse(value))
}
