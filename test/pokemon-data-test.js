var pokemonData = require('../lib/pokemon-data'),
    assert = require('assert')

describe('pokemonData', function() {

    describe('#item', function() {
        it('should map 137 to Greet Mail', function(done) {
            pokemonData.item(137, function(err, item) {
                assert.equal('Greet Mail', item.name)
                done()
            })
        })
    })

    describe('#ability', function() {
        it('should map 50 to Run Away', function(done) {
            pokemonData.ability(50, function(err, ability) {
                assert.equal('Run Away', ability.name)
                done()
            })
        })
    })

    describe('#move', function() {
        it('should map 71 to Absorb', function(done) {
            pokemonData.move(71, function(err, move) {
                assert.equal('Absorb', move.name)
                done()
            })
        })
    })

    describe('#nature', function() {
        it('should map 1 to Lonely', function(done) {
            pokemonData.nature(1, function(err, nature) {
                assert.equal('Lonely', nature.name)
                done()
            })
        })
    })

    describe('#level', function() {
        it('should map Magikarp with 10k exp to lvl 20', function(done) {
            pokemonData.level(129, 10000, function(err, level) {
                assert.equal(20, level.level)
                done()
            })
        })
    })

    describe('#location', function() {
        it('should map 10 in 5th gen to Driftveil City', function(done) {
            pokemonData.location(10, 5, function(err, location) {
                assert.equal('Driftveil City', location.name)
                done()
            })
        })
        it.skip('should map 38 in 6th gen to Kalos Route 7, Rivière Walk', function(done) {
            pokemonData.location(38, 6, function(err, location) {
                assert.equal('Rivière Walk', location.name)
                done()
            })
        })
    })

    describe('#species', function() {
        it('should map 1 to Bulbasaur', function(done) {
            pokemonData.species(1, function(err, species) {
                assert.equal('Bulbasaur', species.name)
                done()
            })
        })
    })

    describe('#form', function() {
        it('should map 493, 5 to Rock Arceus', function(done) {
            pokemonData.form(493, 5, function(err, form) {
                assert.equal('Rock Arceus', form.form_name)
                done()
            })
        })
    })

    describe('#pokeball', function() {
        it('should map 4 to Poké Ball', function(done) {
            pokemonData.pokeball(4, function(err, pokeball) {
                assert.equal('Poké Ball', pokeball.name)
                done()
            })
        })
    })
})
