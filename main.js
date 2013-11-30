var nconf = require('nconf'),
    pokemonPcap = require('./lib/pokemon-pcap'),
    path = require('path')

nconf.argv()
     .file({ file: 'config.json' })
     .defaults({
        pcap: {
            'interface': 'wlan0',
            'filter': 'ip proto \\udp'
        },
        runas: {
            'user': 'nobody',
            'group': 'nogroup'
        },
        web: {
            port: 5008,
            ip: '0.0.0.0'
        },
        data: {
            'dir': path.join(__dirname, '/data')
        }
     })

pokemonPcap.initialize(nconf)
