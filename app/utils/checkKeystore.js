import { toLowerCaseKeys } from './fromV3'
function checkKeystore(keys){
	let jk = JSON.parse(keys)
	let newK = toLowerCaseKeys(jk)
	if((newK.version || newK.version !== 3) || (newK.address || newK.address.length !== 40) || (newK.crypto.ciphertext || newK.crypto.ciphertext.length !== 64) || (newK.crypto.cipherparams.iv || newK.crypto.cipherparams.iv.length !==32) || 
		(newK.crypto.kdfparams.dklen || typeof newK.crypto.kdfparams.dklen === 'number') || (newK.crypto.kdfparams.salt || newK.crypto.kdfparams.salt.length !== 64) || 
		(newK.crypto.mac || newK.crypto.mac.length !== 64) ){
		
		return false
	}else{

		return true
	}
}

export { checkKeystore }