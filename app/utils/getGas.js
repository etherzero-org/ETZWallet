var BigNumber = require('bignumber.js');


var Token = function(contractAddress, userAddress, symbol, decimal, type) {
    this.contractAddress = contractAddress;
    this.userAddress = userAddress;
    this.symbol = symbol;
    this.decimal = decimal;
    this.type = type;
};



function padLeft(n, width, z) {
    z = z || '0';
    n = n + '';
    let arr = new Array(width - n.length + 1).join(z) + n 
    return n.length >= width ? n : arr;
}
function getNakedAddress(address) {
    return address.toLowerCase().replace('0x', '');
}


Token.transferHex = "0xa9059cbb";

Token.prototype.getData = function(toAdd, value) {
    var value = padLeft(new BigNumber(value).times(new BigNumber(10).pow(2)).toString(16), 64);
    var toAdd = padLeft(getNakedAddress(toAdd), 64);
    var data = Token.transferHex + toAdd + value;
    return { data: data }
};


async function getTokenGas(fromAddr,toAddr,tokenSymbol,tokenDecimal,txValue,tokenAddr){

    let tokenObjs = new Token(tokenAddr,fromAddr,tokenSymbol,tokenDecimal,'default')

    let tData = tokenObjs.getData(toAddr, txValue).data


    let estObj = {
            from:fromAddr,
            to: tokenAddr,
            value: '0x00',
            data: tData
    }
    let tokenGas = await web3.eth.estimateGas(estObj)

    return tokenGas
}



function padLeftEven (hex) {
  hex = hex.length % 2 != 0 ? '0' + hex : hex;
  return hex;
}
function sanitizeHex(hex) {
    hex = hex.substring(0, 2) == '0x' ? hex.substring(2) : hex;
    if (hex == "") return "";
    return '0x' + padLeftEven(hex);
}

function decimalToHex(dec) {
    return new BigNumber(dec).toString(16);
}
function stripscript(s) {
    let pattern = new RegExp("[`~!@#$^%&*()=+|{}':;',\\-\\[\\]<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
    let rs = "";
    for (let i = 0; i < s.length; i++) {
        rs = rs+s.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

async function getGeneralGas(genValue,genFromAddr,genToAddr) {

    if(genValue.length > 0 && genToAddr.length > 0){
        let valWei = web3.utils.toWei(genValue,'ether')

        let estObj = {
            from:`0x${genFromAddr}`,
            to: genToAddr,
            value: sanitizeHex(decimalToHex(valWei)),
            data: ''
        }

        let genGas = await web3.eth.estimateGas(estObj)

        return genGas
    }else{
        return
    }


}
export {
    getTokenGas,
    getGeneralGas
}