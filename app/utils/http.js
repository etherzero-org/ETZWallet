import Api from './api'

function transDataToHash (data) {
  let result = ""
  for (var key in data) {
    if (data.hasOwnProperty(key)) {
      var value = data[key];
      if (Array.isArray(value)) {
        result += '&' + key + '=' + value.join(',')
      } else {
        result += '&' + key + '=' + value
      }
    }
  }
  return result
}

async function getOptions (method, url, options) {

  try {
    const { data,} = options

    console.log('参数=',data);

    const fetchOptions = {}
    const cusOptions = {}
   

    const header = {
		            'Accept': 'application/json',
            		'Content-Type': 'application/json',
		          }

    if(method === 'get'){
        url += transDataToHash(data)

        fetchOptions = {
          method: method,
          headers: header,
        }
      }else{

        fetchOptions = {
          method: method,
          headers: header,
          body: JSON.stringify(data),
        }
      }

    cusOptions = Object.assign({}, {
      url,
      fetchOptions
    }, options)

    return cusOptions

  } catch(err) {

    console.log(err)

  }
}


async function cusFetch (options) {
  const { url, fetchOptions, success, fail } = options
  try {
    const res = await fetch(url, fetchOptions)
    console.log('res=====',res)
    const resJson = null
    resJson = await res.json()
    console.log('resJson===',resJson)
    if(resJson.status === "Success"){
    	success(resJson.data)
    }else{
    	const msg = resJson.failure_reason
    	fail(msg)
    }
  } catch(err) {
    console.log('fetch fail',err)
    fail(err)
  }
}

const http = {
  async get (url, options) {
    const cusOptions = await getOptions('get', url, options)
    cusFetch(cusOptions)
  },
  async post (url, options) {
    const cusOptions = await getOptions('post', url, options)
    cusFetch(cusOptions)
  },
  async delete (url, options) {
    const cusOptions = await getOptions('delete', url, options)

    cusFetch(cusOptions)
  }
}

const Http = {
	sendsms: (options) => {
    	http.post(Api.api_sendsms,options)
  	},
  	bindAddress: (options) => {
  		http.post(Api.api_bindAddress,options)
  	}
}
export default Http