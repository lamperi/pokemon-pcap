var PkxDecoder = require('../lib/decoder').PkxDecoder
var assert = require('assert')

describe("PkxDecoder", function() {
    var decoder = new PkxDecoder()
    describe("#decode(wireshark.pkx)", function(done) {
        var data;
        beforeEach(function(done) {
            decoder.decodeFile("test/data/wireshark.pkx", function(err, pokemon_data) {
                data = pokemon_data
                done(err)
            })
        })
        it("should return non-null Object", function() {
            assert(data != null)
            assert(typeof data == "object")
        })
        it("should be a gible", function() {
            assert.equal(443, data.dex_id)
        })
        it("should return object with name Wireshark", function() {
            assert.equal("Wireshark", data.name)
        })
        it("should return Wireshark with proper string length", function() {
            assert.equal("Wireshark".length, data.name.length)
        })
        it("should show OT name Xfr", function() {
            assert.equal("Xfr", data.ot.name)
        })
        it("should show Xfr's ID and secret ID", function() {
            assert.equal(45035, data.ot.id)
            assert.equal(7862, data.ot.secret_id)
        })
        it("should have Sand Veil", function() {
            assert.equal(8, data.ability)
            assert.equal(2, data.ability_number)
            assert.equal("Sand Veil", data.ability_name)
        })
        it("should have no item", function() {
            assert.equal(0, data.item_id)
            assert.equal(undefined, data.item_name)
        })
        it("should have 0 evs across board", function() {
            assert.deepEqual([0,0,0,0,0,0], data.evs)
        })
    })

    var study_poke = function(path) {
        return function() {
            var data;
            beforeEach(function(done) {
                decoder.decodeFile(path, function(err, pokemon_data) {
                    data = pokemon_data
                    done(err)
                })
            })
            it("should return non-null pokemon", function() {
                assert(data)
                console.log(data)
            })
        }
    }

    "test/data/chestpin.pkx test/data/gengar.pkx test/data/poke1.pkx test/data/skitty.pkx test/data/vivillon.pkx test/data/eevee.pkx test/data/lineon.pkx test/data/poke2.pkx test/data/snorlax.pkx".split(/\s+/).forEach(function(file) {
        describe("#decode('" + file + "')", study_poke(file))
    })
})
