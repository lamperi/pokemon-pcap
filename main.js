var nconf = require('nconf'),
    pokemonPcap = require('./lib/pokemon-pcap')

nconf.argv()
     .file({ file: 'config.json' })
     .defaults({
        "pcap:interface": "wlan0",
        "pcap:filter": "ip proto \\udp and length = 991",
        "runas:user": "nobody",
        "runas:group": "nogroup,
        "web:port": 5008
     })

pokemonPcap.initialize(nconf)
