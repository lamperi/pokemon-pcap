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
})
socket.on('disconnect', function() {
    intervalID = setInterval(tryReconnect, 2000)
    document.getElementById('connected').style.display = 'none'
    document.getElementById('disconnected').style.display = 'inline-block'
})
socket.on('connect', function() {
    if (intervalID != null) {
        clearInterval(intervalID)
        intervalID = null
    }
    document.getElementById('connected').style.display = 'inline-block'
    document.getElementById('disconnected').style.display = 'none'
})
