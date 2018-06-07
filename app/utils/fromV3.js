var scrypt  = require('scryptsy');
var crypto = require('crypto');
var sha3 = require('ethereumjs-util').sha3;
import I18n from 'react-native-i18n'
var Wallet = function(priv, pub, path, hwType, hwTransport) {
    if (typeof priv != "undefined") {
        this.privKey = priv.length == 32 ? priv : Buffer(priv, 'hex')
    }
    this.pubKey = pub;
    this.path = path;
    this.hwType = hwType;
    this.hwTransport = hwTransport;
    this.type = "default";
}

function decipherBuffer(decipher, data) {
    return Buffer.concat([decipher.update(data), decipher.final()])
}


function lowerJSONKey(jsonObj){  
    for (var key in jsonObj){  
        jsonObj[ key.toLowerCase() ]  = jsonObj[key];  
        delete(jsonObj[key]);  
    }  
    return jsonObj;  
}  

function toLowerCaseKeys(obj) {
  return Object.keys(obj).reduce(function(accum, key) {
    accum[key.toLowerCase()] = obj[key];
    return accum;
  }, {});
}

async function fromV3(input, password, nonStrict) {
    
    input = toLowerCaseKeys(input)
    
    var json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input : input)

    if (json.version !== 3) {
        throw 'Not a V3 wallet'
    }
    var derivedKey
    var kdfparams
    if (json.crypto.kdf === 'scrypt') {
        kdfparams = json.crypto.kdfparams
        
        derivedKey = await scrypt(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)

    } else if (json.crypto.kdf === 'pbkdf2') {
        kdfparams = json.crypto.kdfparams
        if (kdfparams.prf !== 'hmac-sha256') {
            throw 'Unsupported parameters to PBKDF2'
        }
        derivedKey = await crypto.pbkdf2Sync(new Buffer(password), new Buffer(kdfparams.salt, 'hex'), kdfparams.c, kdfparams.dklen, 'sha256')
    } else {
        throw 'Unsupported key derivation scheme'
    }
    var ciphertext = new Buffer(json.crypto.ciphertext, 'hex')

    var mac = await sha3(Buffer.concat([derivedKey.slice(16, 32), ciphertext]))
    if (mac.toString('hex') !== json.crypto.mac) {
        throw I18n.t('password_is_wrong')
    }

    var decipher = await crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
    var seed = decipherBuffer(decipher, ciphertext, 'hex')
    while (seed.length < 32) {
        var nullBuff = new Buffer([0x00]);
        seed = Buffer.concat([nullBuff, seed]);
    }
    return new Wallet(seed)
}


export { fromV3,toLowerCaseKeys,decipherBuffer, lowerJSONKey }