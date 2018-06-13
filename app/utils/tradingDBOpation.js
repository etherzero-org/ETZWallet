import accountDB from '../db/account_db'
import { fromV3,toLowerCaseKeys, decipherBuffer, lowerJSONKey } from './fromV3'
import { Alert } from 'react-native'
import I18n from 'react-native-i18n'
import { contractAbi } from './contractAbi'
import { scientificToNumber } from './splitNumber'
import scrypt from './scrypt-async'

const sha3 = require('ethereumjs-util').sha3
const crypto = require('crypto')

const EthUtil = require('ethereumjs-util')
const Wallet = require('ethereumjs-wallet')
const EthereumTx = require('ethereumjs-tx')

async function onSaveRecord(options){
	const { parames, saveSuccess, saveFail, } = options
	const { tx_hash, tx_value, tx_sender, tx_receiver, tx_note, tx_token, tx_result,currentAccountName,tx_random } = parames.data


	let tradingData = [],  
  		trading = {},
  		block = 0,
		time = '',
		hashVal = '';
		

  	if(tx_hash.length !== 0){
		let tx = await web3.eth.getTransaction(tx_hash)
		let txBlock  = await web3.eth.getBlock(tx.blockNumber)
  		block = txBlock.number
		time = txBlock.timestamp
		hashVal = tx_hash
  	}

	trading.tx_account_name = currentAccountName
	trading.tx_time = time
	trading.tx_result = tx_result
	trading.tx_random = tx_random
	trading.tx_hash = hashVal
	trading.tx_value = tx_value
	trading.tx_sender = tx_sender
	trading.tx_receiver = tx_receiver
	trading.tx_note = tx_note
	trading.tx_block_number = block	
  	trading.tx_token = tx_token
    tradingData.push(trading) 

    let insertRes = await accountDB.insertToTradingTable(tradingData)
    if(insertRes){
    	saveSuccess(true)
    }else{
    	saveFail(false)
    }
}



async function onMakeTxByETZ(options) {
	const { parames, txETZSuccess, txETZFail } = options
	const { txPsdVal,senderAddress,txValue,receiverAddress,noteVal,gasValue, fetchTokenList, keyStore, pendingMark } = parames.info
	try{
		let input = toLowerCaseKeys(keyStore)
		let json = (typeof input === 'object') ? input : JSON.parse(input)
		let privKey = await fromV3(json,txPsdVal)
	  	console.log('解析出的撕咬',privKey)
	    let bufPrivKey = new Buffer(privKey, 'hex')

	    console.log('senderAddress',senderAddress)
	    console.log('txValue',txValue)
	    
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
	    console.log('txParams',txParams)
	    const tx = new EthereumTx(txParams)
	    console.log('tx1111',tx)
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
		                txETZSuccess(hashVal,pendingMark)
		       }else{
		                txETZFail(hashVal,I18n.t('send_failure'),1,pendingMark)//第一个参数 hash值, 第二个参数 错误提示信息 第三个参数 1 转账失败  这条记录也需要在本地数据库中保存
		      }          
		  })
		  .on('error', (error) => {
		    	console.log('error11',error)
		        txETZFail(hashVal,`${error}`,1,pendingMark)
	    })

	} catch (err){
		console.log('error22',err)
	    txETZFail('',`${err}`,0,pendingMark)
	}
}

async function onMakeTxByToken(options) {
	const { parames, txTokenSuccess, txTokenFail, } = options
	const { txPsdVal, senderAddress, txValue, receiverAddress, noteVal, gasValue, fetchTokenList, keyStore, pendingMark,currentTokenDecimals,currentTokenName, currentTokenAddress } = parames.info
	try{
		let input = toLowerCaseKeys(keyStore)
		let json = (typeof input === 'object') ? input : JSON.parse(input)
		let privKey = await fromV3(json,txPsdVal)
      
	    let txNumber = parseFloat(txValue) *  Math.pow(10,currentTokenDecimals)
	      
	      
	    let hex16 = parseFloat(txNumber).toString(16)      
	 
	    let myContract = new web3.eth.Contract(contractAbi, currentTokenAddress)

	    let data = myContract.methods.transfer(receiverAddress, `0x${hex16}`).encodeABI()

	    web3.eth.getTransactionCount(`0x${senderAddress}`, function(error, nonce) {
	        let gas = parseFloat(gasValue) + 500
	        const txParams = {
	            nonce: web3.utils.toHex(nonce),
	            gasPrice:"0x098bca5a00",
	            gasLimit: `0x${gas.toString(16)}`,
	            to: currentTokenAddress,
	            value :"0x0",
	            data: data,
	            chainId: "0x58"
	        }
	        console.log("txParams:", txParams)

	        // 通过明文私钥初始化钱包对象key
	        const privateKey = Buffer.from(privKey, 'hex')

	        let key = Wallet.fromPrivateKey(privateKey)

	        const tx = new EthereumTx(txParams)
	        
	        tx.sign(key.getPrivateKey())

	        var serializedTx = '0x' + tx.serialize().toString('hex')

	        console.log("serializedTx: ", serializedTx)
	        
	        let hashVal = ''

	        web3.eth.sendSignedTransaction(serializedTx).on('transactionHash', function(hash){
	            console.log('transactionHash:', hash)
	            hashVal = hash

	        })
	        .on('receipt', function(receipt){
	            console.log('receipt:', receipt)
	            if(receipt.status==="0x1" || receipt.status == true){
	              	txTokenSuccess(hashVal,pendingMark)
	            }else{
	              	txTokenFail(hashVal,I18n.t('send_failure'),1,pendingMark)
	            }
	        }).on('error', (error) => {
	            console.log('代币交易失败111',error)
	            let h = hashVal.length > 0 ? hashVal : ''
	           	txTokenFail(h,`${error}`,1,pendingMark)
	        })
	    })

	}catch (error){
		console.log('代币交易失败2',error)
	    txTokenFail('',`${error}`,0,pendingMark)
	}
}
const tradingDBOpation = {
	tradingSaveToRecord: (options) => {
		onSaveRecord(options)
	},
	makeTxByETZ: (options) => {
		onMakeTxByETZ(options)
	},
	makeTxByToken: (options) => {
		onMakeTxByToken(options)
	}

}
export default tradingDBOpation