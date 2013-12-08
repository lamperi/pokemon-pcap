// Connection to node.js server
function tryReconnect() {
    if (socket.socket.connected === false && socket.socket.connecting === false) {
        socket.socket.connect()
    }
}
var intervalID = null
var i = 0
var socket = io.connect(location.protocol + location.hostname + ":" + config.port)
socket.on('pokemon', function(data) {
    var target = data.side + '-pokemon'
    document.getElementById(target).innerHTML = Handlebars.templates.pokemon(data.pokemon)

    var select = document.getElementById(data.side + '-list')
    var option = new Option(Handlebars.templates.pokemonTitle(data.pokemon), JSON.stringify(data.pokemon), false, true)
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

$('#left-list, #right-list').on('change', onPokemonChange ) 
function onPokemonChange() {
    var value = this.options[this.selectedIndex].value
    var target = document.getElementById(this.id.replace("list", "pokemon"))
    target.innerHTML = Handlebars.templates.pokemon(JSON.parse(value))
}
$('#left-export, #right-export').on('click', function() {
    var $select = $('#' + this.id.replace('export', 'list')), exports = []
    $select.find('option').each(function() {
        exports.push($(this).text())
    })
    var text = exports.join('')
    var $modal = $('#export-modal')
    var rows = Math.min(Math.max(10, exports.length), 30)
    $modal.find('textarea').attr('rows', rows).text(text)
    $modal.modal('toggle')

}).popover({'placement': 'top'})
