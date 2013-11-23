var Detector = require('../lib/detector').Detector,
    fs = require('fs'),
    sinon = require('sinon'),
    assert = require('assert')

describe('Detector', function() {
    var detector = new Detector()
    describe('testPacket()', function() {
        it('should not detect anything on packet1', function() {
            detector.emit = sinon.spy()
            var packet = fs.readFileSync('test/raw-series/packet1.bin')
            detector.testPacket(packet)

            assert.ok(!detector.emit.called)
        })

        it('should detect pokemon on packet179', function() {
            detector.emit = sinon.spy()
            var packet = fs.readFileSync('test/raw-series/packet179.bin')
            detector.testPacket(packet)

            assert.ok(detector.emit.called)
        })

        it('should detect pokemon on packet176', function() {
            detector.emit = sinon.spy()
            var packet = fs.readFileSync('test/raw-series/packet176.bin')
            detector.testPacket(packet)

            assert.ok(detector.emit.called)
        })
    })
})
