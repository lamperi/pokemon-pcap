// Code to decrypt pokemon pkx files
// Algorithm by Xfr and Bond697
var Long = require('long')

var PkxSizes = {
    SIZE_PARTY_PKX      : 260,
    SIZE_BOX_PKX        : 232,
    SIZE_PKX_UNCRYPT    : 8,
    SIZE_PKX_CRYPT_LEN  : 232 - 8,
    SIZE_PKX_BLK        : 56,
    SIZE_PKX_PARTY_DATA : 28
}

function Rnd(data) {
    this.mul  = 0x41C64E6D
    this.add  = 0x6073
    this.rmul = 0xEEB9EB65
    this.radd = 0xA3561A1
    this.data = data
}

Rnd.prototype.advance = function() {
    var data_l = new Long(this.data, 0)
    var mul_l = new Long(this.mul, 0)
    this.data = (data_l.multiply(mul_l).low + this.add) & 0xFFFFFFFF
    return (this.data >> 16) & 0xFFFF
}

var orders = [
    [0, 1, 2, 3],
    [0, 1, 3, 2],
    [0, 2, 1, 3],
    [0, 3, 1, 2],
    [0, 2, 3, 1],
    [0, 3, 2, 1],
    [1, 0, 2, 3],
    [1, 0, 3, 2],
    [2, 0, 1, 3],
    [3, 0, 1, 2],
    [2, 0, 3, 1],
    [3, 0, 2, 1],
    [1, 2, 0, 3],
    [1, 3, 0, 2],
    [2, 1, 0, 3],
    [3, 1, 0, 2],
    [2, 3, 0, 1],
    [3, 2, 0, 1],
    [1, 2, 3, 0],
    [1, 3, 2, 0],
    [2, 1, 3, 0],
    [3, 1, 2, 0],
    [2, 3, 1, 0],
    [3, 2, 1, 0]
];


function decrypt(in_pkx) {
    var box_pkx = new Buffer(PkxSizes.SIZE_BOX_PKX)
    var outbox_pkx = new Buffer(PkxSizes.SIZE_BOX_PKX)
    var party_data = new Buffer(PkxSizes.SIZE_PKX_PARTY_DATA)
    var out_pkx = new Buffer(in_pkx.length)

    in_pkx.copy(box_pkx, 0, 0, PkxSizes.SIZE_PARTY_PKX)

    if ((in_pkx.length != PkxSizes.SIZE_PARTY_PKX) && (in_pkx.length != PkxSizes.SIZE_BOX_PKX))
    {
        throw new Error("Pkx is the wrong size.");
    }


    var decryptKey = box_pkx.readUInt32LE(0)

    CryptPkx(box_pkx.slice(8), decryptKey)
    UnshufflePkx(box_pkx, outbox_pkx);
    SetUncryptedDataEqual(box_pkx, outbox_pkx);

    if (!VerifyPkxChecksum(box_pkx.slice(8), box_pkx.readUInt16LE(6), PkxSizes.SIZE_PKX_CRYPT_LEN))
    {
        throw new Error("Checksum failed.")
    }

    if (in_pkx.length == PkxSizes.SIZE_PARTY_PKX)
    {
        decryptKey = box_pkx.readUInt32LE(0)

        in_pkx.copy(party_data, PkxSizes.SIZE_BOX_PKX, 0, PkxSizes.SIZE_PKX_PARTY_DATA)

        CryptPkx(party_data, decryptKey);
    }

    outbox_pkx.copy(out_pkx, 0, 0, PkxSizes.SIZE_BOX_PKX)

    if (in_pkx.length == PkxSizes.SIZE_PARTY_PKX)
    {
        party_data.copy(out_pkx, 0, PkxSizes.SIZE_BOX_PKX, PkxSizes.SIZE_PKX_PARTY_DATA)
    }

    return out_pkx
}

function CryptPkx(pkx, key) {
    var cryptKey = 0, i, len = pkx.length
    var cr = new Rnd(key)
    for (i = 0; i < len; i+=2) {
        cryptKey = cr.advance()
        pkx.writeUInt16LE(pkx.readUInt16LE(i) ^ cryptKey, i)
    }
}

function CalcPkxChecksum(pkx, len) {
    var sum = 0, i
    for (i = 0; i < len; i+=2) {
        sum += pkx.readUInt16LE(i)
    }
    return sum & 0xFFFF
}

function VerifyPkxChecksum(pkx, currentSum, len) {
    var checksum = CalcPkxChecksum(pkx, len)
    return checksum === currentSum
}

function FixPkxChecksum(pkx, len) {
    var sum = CalcPkxCheckSum(pkx.slice(8), len)
    pkx.writeUInt16LE(sum, 6)
}

function GetShuffleType(pid) {
    return ((pid & 0x3E000) >> 0xD) % 24;
}

function UnshufflePkx(pkx_in, pkx_out) {
    var blockOrder = GetShuffleType(pkx_in.readUInt32LE(0)), i
    for (i = 0; i < 4; ++i) {
        var sourceStart = PkxSizes.SIZE_PKX_UNCRYPT + (PkxSizes.SIZE_PKX_BLK * orders[blockOrder][i])
        pkx_in.copy(pkx_out, PkxSizes.SIZE_PKX_UNCRYPT + (PkxSizes.SIZE_PKX_BLK * i),
                sourceStart, sourceStart + PkxSizes.SIZE_PKX_BLK)
    }
}

function SetUncryptedDataEqual(pkx_in, pkx_out) {
    pkx_in.copy(pkx_out, 0, 0, 8)
}

exports.decrypt = decrypt
