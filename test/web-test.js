var phantom = require('phantom')
var PokemonWeb = require('../lib/web').PokemonWeb

describe.skip('PokemonWeb', function() {
    var pokemonWeb = new PokemonWeb(5001, '0.0.0.0')
    var ph
    before(function(once) {
        phantom.create({port: 5002}, function(_ph) {
            ph = _ph
            once()
        })
    })

    it('should serve index.html', function(once) {
        ph.createPage(function(page) {
            page.open('http://localhost:5001', function(status) {
                assert.equal('success', status)
                once()
            })
        })
    })
})
