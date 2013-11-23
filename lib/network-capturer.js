var util = require('util'),
    pcap = require("pcap"), pcap_session,
    fs = require('fs'),
    EventEmitter = require('events').EventEmitter
    
function NetworkCapturer(iface, filter) {
    this.iface = iface
    this.filter = filter
}
util.inherits(NetworkCapturer, EventEmitter)

NetworkCapturer.prototype.startSession = function() {
    var foundIface = false
    var device = this.iface
    pcap.Pcap.findalldevs().forEach(function (dev) {
        if (device === dev.name) {
            foundIface = true
        }
    })
    if (foundIface) {
        this.pcap_session = pcap.createSession(this.iface, this.filter);
        this.pcap_session.on('packet', this.inspectPacket.bind(this))
    }
    return foundIface
}

NetworkCapturer.prototype.inspectPacket = function(raw_packet) {
    var packet = pcap.decode.packet(raw_packet);

    if (packet.link_type == 'LINKTYPE_ETHERNET' && packet.link && packet.link.ip && packet.link.ip.protocol_name == 'UDP') {
        if (packet.link.ip.udp.data) {
            this.emit('udp_packet', packet.link.ip.udp.data)
        }
    }
    if (packet.link_type == 'LINKTYPE_ETHERNET' && packet.link && packet.link.ip && packet.link.ip.protocol_name == 'TCP') {
        if (packet.link.ip.tcp.data) {
            this.emit('tcp_packet', packet.link.ip.tcp.data)
        }

    }
}

exports.NetworkCapturer = NetworkCapturer