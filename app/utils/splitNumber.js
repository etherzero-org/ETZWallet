 function splitNumber(string){
          let sss = ''

          if(parseFloat(string) < 1){
            let dd = aa(string.toString().slice(2))
            sss = '0.' + dd
          }else{
            sss = aa(string.toString())
          }
          
          return sss

    }

function aa(str){
  let rmb='',
        i2=0;
  for(let i=str.length-1; i>=0; i--){
          if(i%3==0&&i!=0){
              rmb+=str[i2]+','
          }else{
              rmb+=str[i2]
          }
          i2++
      }
      return rmb
}


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

  if(d.lastIndexOf('.') === -1){
    time = parseInt(d)*1000
  }else{
    time = parseInt(d.slice(0,d.lastIndexOf('.')))*1000
  }
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

export { 
  splitNumber,
  sliceAddress,
  timeStamp2Date,
  timeStamp2FullDate,
  splitDecimal,
  timeSFullData
}