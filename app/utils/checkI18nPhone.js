function checkI18nPhone(cca2,callingCode,phone){
	if(phone.length === 0){
			throw '请输入手机号'
			return false
	}else{
		if(isNaN(phone)){
			throw '非法手机号'
			return false
		}else{
			if(callingCode === '86' && cca2 === 'CN'){
				if(/^1[3,5,7,8]\d{9}$/.test(phone)){
					return true
				}else{
					throw '非法手机号'
					return false
				}
			}else{
				// i18n
				// throw '国际手机号'
			}
		}
	}

}

export { checkI18nPhone }