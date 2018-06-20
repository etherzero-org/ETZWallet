// var scrypt  = require('scryptsy');
var crypto = require('crypto');
var sha3 = require('ethereumjs-util').sha3;

import scrypt from './scrypt-async'

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


//重写formv3
async function fromV3 (input,password) {
    console.log('fromV3 password',password)
    console.log('fromV3 input',input)
    
    input = toLowerCaseKeys(input)
    let json = (typeof input === 'object') ? input : JSON.parse(input)

    if(json.version !== 3) {
        throw 'Not a V3 wallet'
        return
    }


    let kdfparams = json.crypto.kdfparams
    let seedKey 
    scrypt(new Buffer(password), new Buffer(kdfparams.salt,'hex'), {
        N: kdfparams.n,
        r: kdfparams.r,
        p: kdfparams.p,
        dkLen: kdfparams.dklen,
        encoding: 'hex'
    },(derived) => {
          let derivedKey = new Buffer(derived,'hex')
          let ciphertextBuf = new Buffer(json.crypto.ciphertext, 'hex')

          let buf = Buffer.concat([new Buffer(derivedKey,'hex').slice(16,32), ciphertextBuf])
          let mac = sha3(buf)

          if (mac.toString('hex') !== json.crypto.mac) {
              throw(I18n.t('password_is_wrong')) 
              return
          }

          let decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
          
          let seed = decipherBuffer(decipher, ciphertextBuf, 'hex')


          while (seed.length < 32) {
              let nullBuff = new Buffer([0x00]);
              seed = Buffer.concat([nullBuff, seed]);
          }
          seedKey = seed.toString('hex')
    })
    return seedKey
}


export { fromV3,toLowerCaseKeys,decipherBuffer, lowerJSONKey }