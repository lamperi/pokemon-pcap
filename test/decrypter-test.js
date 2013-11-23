var Decrypter = require('../lib/decrypter').Decrypter,
    sinon = require('sinon'),
    fs = require('fs'),
    assert = require('assert')

describe('Decrypter', function() {
    var decrypter = new Decrypter()
    describe('#decrypt()', function() {
        sinon.spy(decrypter, "emit")

        afterEach(function() {
            decrypter.emit.reset()
        })

        it('should decrypt poke1.bin', function() {
            var encrypted = fs.readFileSync('test/encrypted-data/poke1.bin')
            var decrypted = fs.readFileSync('test/data/poke1.pkx')
            decrypter.decrypt(encrypted)

            assert.ok(decrypter.emit.calledOnce)
            assert.equal("pkx", decrypter.emit.args[0][0]) 
            assert.equal(decrypted.toString(), decrypter.emit.args[0][1].toString()) 
        })
        
        it('should decrypt poke2.bin', function() {
            var encrypted = fs.readFileSync('test/encrypted-data/poke2.bin')
            var decrypted = fs.readFileSync('test/data/poke2.pkx')
            decrypter.decrypt(encrypted)

            assert.ok(decrypter.emit.calledOnce)
            assert.equal("pkx", decrypter.emit.args[0][0]) 
            assert.equal(decrypted.toString(), decrypter.emit.args[0][1].toString()) 
        })

        it('should fail on bad size packet', function() {
            var buffer = new Buffer(200)
            decrypter.decrypt(buffer)

            assert.ok(decrypter.emit.calledOnce)
            assert.equal("pkx_failed", decrypter.emit.args[0][0]) 
        })

        it('should fail on bad formed packet', function() {
            var encrypted = fs.readFileSync('test/encrypted-data/poke2.bin') 
            encrypted[100] = 13
            encrypted[101] = 37

            decrypter.decrypt(encrypted)

            assert.ok(decrypter.emit.calledOnce)
            assert.equal("pkx_failed", decrypter.emit.args[0][0]) 
        })
    })
})
