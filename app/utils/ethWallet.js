//创建账号

var crypto = require('crypto')
var scrypt  = require('scryptsy');
var sha3 = require('ethereumjs-util').sha3
var ethUtil = require('ethereumjs-util')
var uuid = require('react-native-uuid');

var HDKey = require('hdkey')
let privKey = null 

function EthereumHDKey () {

}
var ethWallet = function (priv, pub, path, hwType, hwTransport) {
    if (typeof priv != "undefined") {
        privKey = priv.length == 32 ? priv : Buffer(priv, 'hex')
    }
    this.pubKey = pub;
    this.path = path;
    this.hwType = hwType;
    this.hwTransport = hwTransport;
    this.type = "default";
}

 ethWallet.generate = function() {
    
    return new ethWallet(crypto.randomBytes(32))
    
}


ethWallet.prototype.getPrivateKey = function () {
  return privKey
}

ethWallet.prototype.getAddress = function(){
    return ethUtil.privateToAddress(privKey)
}


ethWallet.fromPrivateKey = function (priv) {
  return new ethWallet(priv)
}

EthereumHDKey.prototype.getWallet = function() {
    console.log('getWallet priv=',this._hdkey._privateKey)
   return ethWallet.fromPrivateKey(this._hdkey._privateKey)
}



function fromHDKey (hdkey) {
  var ret = new EthereumHDKey()
  ret._hdkey = hdkey
  return ret
}


EthereumHDKey.fromMasterSeed = function (seedBuffer) {
  return fromHDKey(HDKey.fromMasterSeed(seedBuffer))
}
// EthereumHDKey.prototype.publicExtendedKey = function () {
//   return this._hdkey.publicExtendedKey
// }
ethWallet.prototype.toV3 = function(password, opts) {
    opts = opts || {}
    var salt = opts.salt || crypto.randomBytes(32)
    var iv = opts.iv || crypto.randomBytes(16)
    var derivedKey
    var kdf = opts.kdf || 'scrypt'
    var kdfparams = {
        dklen: opts.dklen || 32,
        salt: salt.toString('hex')
    }
    if (kdf === 'pbkdf2') {
        kdfparams.c = opts.c || 262144
        kdfparams.prf = 'hmac-sha256'
        derivedKey = crypto.pbkdf2Sync(new Buffer(password), salt, kdfparams.c, kdfparams.dklen, 'sha256')
    } else if (kdf === 'scrypt') {
        // FIXME: support progress reporting callback
        kdfparams.n = opts.n || 262144
        kdfparams.r = opts.r || 8
        kdfparams.p = opts.p || 1
        derivedKey = scrypt(new Buffer(password), salt, kdfparams.n, kdfparams.r, kdfparams.p, kdfparams.dklen)
    } else {
        console.log('Unsupported kdf')
    }
    var cipher = crypto.createCipheriv(opts.cipher || 'aes-128-ctr', derivedKey.slice(0, 16), iv)
    if (!cipher) {
        console.log('Unsupported cipher')
    }
    var ciphertext = Buffer.concat([cipher.update(privKey), cipher.final()])
    var mac = sha3(Buffer.concat([derivedKey.slice(16, 32), new Buffer(ciphertext, 'hex')]))
    return {
        version: 3,
        id: uuid.v4({
            random: opts.uuid || crypto.randomBytes(16)
        }),
        address: this.getAddress().toString('hex'),
        crypto: {
            ciphertext: ciphertext.toString('hex'),
            cipherparams: {
                iv: iv.toString('hex')
            },
            cipher: opts.cipher || 'aes-128-ctr',
            kdf: kdf,
            kdfparams: kdfparams,
            mac: mac.toString('hex')
        }
    }
}

export { ethWallet, EthereumHDKey }

//创建钱包
// function genNewWallet() {
    
//     let wallet = generate()
//     let password = '123456789'
//     let kdf = 'scrypt'
//     let scrypt = {
//         n: 8192,
//         c: 8192
//     }

//     let wa = wallet.toV3(password,{
//         kdf: kdf,
//         n: scrypt.n,
//         c: scrypt.c
//     })
//     console.log('res==',wa)
    
// }

// genNewWallet()


//转成小写
// let k = {"version":3,"id":"d9aa3f6a-c153-436e-85e6-0a1893b736f5","address":"47efa16388185294551fa34b0aefc5744f910f60","Crypto":{"ciphertext":"4bd56521343e320ffae25103b3b27d99ece4237691f1a8566c3f113fade503ed","cipherparams":{"iv":"fb2e381c7d12fcb2bb6f88ee950a392f"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"986135b4bdc021326b0f610682abd8f658cefb5273c7d2da6e87bcb419eca7e2","n":8192,"r":8,"p":1},"mac":"f29191f1e3565a43a98cba47abe5e4ff6a55c55ec013a10130e0b7ec535e1a7c"}}

// function toLowerCaseKeys(obj) {
//   return Object.keys(obj).reduce(function(accum, key) {
//     accum[key.toLowerCase()] = obj[key];
//     return accum;
//   }, {});
// }

// let a = toLowerCaseKeys(k)
// console.log(a)
