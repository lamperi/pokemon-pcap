
var i = 0
var socket = io.connect(location.protocol + location.hostname + ":" + config.port)
socket.on('pokemon', function(data) {
    var target = data.side + '-pokemon'
    document.getElementById(target).innerHTML = Handlebars.templates.pokemon(data.pokemon)
})
