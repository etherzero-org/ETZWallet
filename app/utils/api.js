const version = 'v1'
const path = 'http://54.193.114.251:7001/api/' + version + '/'

const Api = {
	api_sendsms: path + 'sendsms',
	api_bindAddress: path + 'createinfo',
}
export default Api