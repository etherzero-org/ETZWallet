import accountDB from '../db/account_db'

async function onSaveRecord(options){
	const { parames, saveSuccess, saveFail, } = options
	const { tx_hash, tx_value, tx_sender, tx_receiver, tx_note, tx_token, tx_result,currentAccountName } = parames.data


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
const tradingDBOpation = {
	
	tradingSaveToRecord: (options) => {
		onSaveRecord(options)
	},
}
export default tradingDBOpation