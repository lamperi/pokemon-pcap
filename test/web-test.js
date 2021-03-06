var PokemonWeb = require('../lib/web').PokemonWeb,
    assert = require('assert')

// TODO write better web tests
// phantom is pretty heavyweight just for this
describe.skip('PokemonWeb', function() {
    var phantom = require('phantom')
    var pokemonWeb = new PokemonWeb(5001, '0.0.0.0')
    var ph
    before(function(once) {
        phantom.create({port: 5010+(Math.random()%100)}, function(_ph) {
            ph = _ph
            once()
        })
    })

    it('should serve index.html', function(once) {
        ph.createPage(function(page) {
            page.open('http://localhost:5001/index.html', function(status) {
                assert.equal('success', status)
                once()
            })
        })
    })

})
