import { fromV3 } from './fromV3'
import { Alert } from 'react-native'
const EthUtil = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet')
const EthereumTx = require('ethereumjs-tx')
async function onMakeTxByETZ(options) {
	const { parames, txETZSuccess, txETZFail } = options
	const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,gasValue, fetchTokenList, keyStore } = parames.info
	try{  

      let newWallet = await web3.eth.accounts.decrypt(keyStore, txPsdVal);

      console.log('newWallet111111111111111111',newWallet)
      let privKey = newWallet.privateKey.slice(2,)
      // let newWallet = await fromV3(keyStore,txPsdVal)

      // let privKey = newWallet.privKey.toString('hex')

      let bufPrivKey = new Buffer(privKey, 'hex')

      let nonceNumber = await web3.eth.getTransactionCount(`0x${senderAddress}`)

      let totalValue = web3.utils.toWei(txValue,'ether')

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
                txETZSuccess(hashVal)
           }else{
           	    txETZFail(hashVal,I18n.t('send_successful'),1)
          }          
      })
      .on('error', (error) => {
      	console.log('error11',error)
        // Alert.alert(error)
        txETZFail('',error,0)
      })
    }catch(error){
    	console.log('error22',error)
	    // Alert.alert(`${error}`)
	    txETZFail('',`${error}`,0)
    }
}
const txOpation = {
	
	makeTxByETZ: (options) => {
		onMakeTxByETZ(options)
	},
}
export default txOpation