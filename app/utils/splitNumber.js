
let splitNumber = (() => {  
  let DIGIT_PATTERN = /(^|\s)\d+(?=\.?\d*($|\s))/g
  let MILI_PATTERN = /(?=(?!\b)(\d{3})+\.?\b)/g
  return (num) => num && num.toString()
    .replace(DIGIT_PATTERN, (m) => m.replace(MILI_PATTERN, ','))
})()


function sliceAddress(str,len){
  len = len || 8
  return `${str.slice(0,len)}...${str.slice(str.length-len,str.length)}`
}

function timeStamp2Date(d){
  let time = 0,
      timeStr = '';

  if(d.lastIndexOf('.') === -1){
    time = parseInt(d)*1000
  }else{
    time = parseInt(d.slice(0,d.lastIndexOf('.')))*1000
  }
  let date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  timeStr = `${day}/${month+1}/${year}`
  return timeStr
}

function timeStamp2FullDate(d){
  let time = 0,
      fullTime = '';

  // if(d.lastIndexOf('.') === -1){
  //   time = parseInt(d)*1000
  // }else{
  //   time = parseInt(d.slice(0,d.lastIndexOf('.')))*1000
  // }

  if(d.length === 0){
    fullTime = 'pending'
    return fullTime 
  }else{
    time = parseInt(d)*1000
    let date = new Date(time)
    let year = date.getFullYear()
    let month = date.getMonth()
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let second = date.getSeconds()

    fullTime = `${day}/${month+1}/${year} ${hour}:${min}:${second}`
    return fullTime
  }
}
function timeSFullData(t){
  
  let fullTime = '';
  let date = new Date(t*1000)
  let year = date.getFullYear()
  let month = date.getMonth()
  let day = date.getDate()
  let hour = date.getHours()
  let min = date.getMinutes()
  let second = date.getSeconds()

  fullTime = `${day}/${month+1}/${year} ${hour}:${min}:${second}`
  return fullTime
}
function splitDecimal(str){
  let y = String(str).indexOf(".") + 1
  let count = String(str).length - y

  let be = String(str).slice(0,y-1)

  let newString = ''
  if(y > 0) {
    if(count > 8){
      newString = `${be}.${String(str).slice(y,9+be.length)}`
    }else{
      newString = `${be}.${String(str).slice(y,)}`
    }
  }else{
    newString = String(str)
  }
  return newString
}




function scientificToNumber(num_str){  //参数必须为 字符串
    //科学计数法字符 转换 为数字字符， 突破正数21位和负数7位的Number自动转换
    // 兼容 小数点左边有多位数的情况，即 a×10^b（aEb），a非标准范围（1≤|a|<10）下的情况。如 3453.54E-6 or 3453.54E6
    if(!/e/.test(num_str)){
      return num_str
    }else{
      var resValue = '',
        power = '',
        result = null,
        dotIndex = 0,
        resArr = [],
        sym = '';
      var numStr = num_str.toString();
      if(numStr[0] == '-'){  // 如果为负数，转成正数处理，先去掉‘-’号，并保存‘-’.
        numStr = numStr.substr(1);
        sym = '-';
      }
      if ((numStr.indexOf('E') != -1) ||(numStr.indexOf('e') != -1)){
          var regExp = new RegExp( '^(((\\d+.?\\d+)|(\\d+))[Ee]{1}((-(\\d+))|(\\d+)))$','ig' );
          result = regExp.exec(numStr);
       
          if (result != null){
              resValue = result[2];
              power = result[5];
              result = null;
          }
          if (!resValue && !power){ return false}
          dotIndex = resValue.indexOf('.');
          resValue = resValue.replace('.','');
          resArr = resValue.split('');
          if(Number(power) >= 0){
              var subres = resValue.substr(dotIndex);
              power = Number(power);
              //幂数大于小数点后面的数字位数时，后面加0
              for(var i=0; i<power-subres.length; i++) {
                resArr.push('0');
            }
              if(power-subres.length < 0){
                resArr.splice(dotIndex+power, 0, '.');
              }
          }else{
              power = power.replace('-','');
              power = Number(power);
              //幂数大于等于 小数点的index位置, 前面加0
              for(var i=0; i<=power-dotIndex; i++) {
              resArr.unshift('0');
            }
              var n = power-dotIndex >= 0 ? 1 : -(power-dotIndex);
              resArr.splice(n, 0, '.');
          }
      }
      resValue = resArr.join('');
      return sym+resValue;
    }
}
export { 
  splitNumber,
  sliceAddress,
  timeStamp2Date,
  timeStamp2FullDate,
  splitDecimal,
  timeSFullData,
  scientificToNumber
}