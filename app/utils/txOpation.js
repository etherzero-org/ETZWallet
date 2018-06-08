import { fromV3,toLowerCaseKeys, decipherBuffer, lowerJSONKey } from './fromV3'
import { Alert } from 'react-native'
const scrypt = require('scrypt-async')
const sha3 = require('ethereumjs-util').sha3
const crypto = require('crypto')

const EthUtil = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet')
const EthereumTx = require('ethereumjs-tx')

async function txETZ(data){
  const { senderAddress,txValue,receiverAddress,gasValue } = data.parames
  let privKey = data.seed.toString('hex')
  
  let bufPrivKey = new Buffer(privKey, 'hex')

  let nonceNumber = await web3.eth.getTransactionCount(`0x${senderAddress}`)

  let totalValue = await web3.utils.toWei(txValue,'ether')

  let hex16 = parseInt(totalValue).toString(16)

  const txParams = {
      nonce: `0x${nonceNumber.toString(16)}`,
      gasPrice: '0x09184e72a000', 
      gasLimit: `0x${parseFloat(gasValue).toString(16)}`,
      to: receiverAddress,
      value: `0x${hex16}`,
      data: '',
      chainId: 88
  }

  const tx = new EthereumTx(txParams)

  tx.sign(bufPrivKey)

  const serializedTx = tx.serialize()

  let hashVal = ''

  web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
  .on('transactionHash', function(hash){
    console.log('hash111',hash)
    hashVal = hash
  })
  .on('receipt', function(receipt){
      if(receipt.status==="0x1" || receipt.status == true){    
            data.txETZSuccess(hashVal)
       }else{
            data.txETZFail(hashVal,I18n.t('send_failure'),1)//第一个参数 hash值, 第二个参数 错误提示信息 第三个参数 1 转账失败  这条记录也需要在本地数据库中保存
      }          
  })
  .on('error', (error) => {
    console.log('error11',error)
    // Alert.alert(error)
    data.txETZFail('',error,0)// 0 这里的失败  可能是余额不足等原因导致的   因此 不能存在本地数据库中  之前存过pending状态的那条数据也要删除
  })
  }catch(error){
    console.log('error22',error)
    data.txETZFail('',`${error}`,0)
  }
}

async function onMakeTxByETZ(options) {
	const { parames, txETZSuccess, txETZFail } = options
	const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,gasValue, fetchTokenList, keyStore } = parames.info
	try{  
      let input = toLowerCaseKeys(keyStore)
      console.log('input===',input)
      var json = (typeof input === 'object') ? input : JSON.parse(nonStrict ? input : input)

      if (json.version !== 3) {
          throw 'Not a V3 wallet'
      }
      var kdfparams = json.crypto.kdfparams
      
      console.log('kdfparams==',kdfparams)

      scrypt(new Buffer(txPsdVal), new Buffer(kdfparams.salt,'hex'), {
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
              Alert.alert(I18n.t('password_is_wrong')) 
              return
          }

          var decipher = crypto.createDecipheriv(json.crypto.cipher, derivedKey.slice(0, 16), new Buffer(json.crypto.cipherparams.iv, 'hex'))
          
          var seed = decipherBuffer(decipher, ciphertextBuf, 'hex')

          while (seed.length < 32) {
              var nullBuff = new Buffer([0x00]);
              seed = Buffer.concat([nullBuff, seed]);
          }

          txETZ({
            seed,
            parames: parames.info,
            txETZSuccess,
            txETZFail,
          })

      })
}
const txOpation = {
	
	makeTxByETZ: (options) => {
		onMakeTxByETZ(options)
	},
}
export default txOpation