/**
 *
 * @param {*} callback 回调方法，返回一个promise
 * @param {*} args value
 * @returns
 */
function nano_promise(callback, args = []) {
	return () => {
		return new Promise((resolve, reject) => {
			args.push(resolve, reject)
			callback(...args)
		})
	}
}

/**
 *
 * @param {*} key 存储键值对信息
 * @param {*} value
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
async function session_set(key, value, resolve = () => { }, reject = () => { }) {
	try {
		if (!key) {
			console.error("session key can't null")
			reject()
			return false
		}
		chrome.storage.local.set(
			{
				[key]: value,
			},
			function (res) {
				let error = chrome.runtime.lastError
				if (error) {
					console.warn(JSON.stringify(error))
					reject(JSON.stringify(error))
				}
				resolve(res)
			}
		)
	} catch (e) {
		reject(e)
	}
}
/**
 *
 * @param {*} object 存储多个key
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
async function session_set_objects(object, resolve = () => { }, reject = () => { }) {
	try {
		if (!object) {
			console.error("session object can't null")
			reject()
			return false
		}
		chrome.storage.local.set(object, function (res) {
			resolve(object)
		})
	} catch (e) {
		{
		}
		reject(e)
	}
}
/**
 *
 * @param {*} key 获取单个key值
 * @param {*} default_value
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
async function session_get(key, default_value = null, resolve = () => { }, reject = () => { }) {
	try {
		if (!key) {
			console.error("session key can't null")
			reject()
			return false
		}
		chrome.storage.local.get(
			{
				[key]: null,
			},
			function (res) {
				if (res[key]) {
					resolve(res[key])
				} else {
					resolve(default_value)
				}
			}
		)
	} catch (e) {
		reject(e)
	}
}

/**
 *
 * @param {*} items 获取对个key值
 * @param {*} resolve
 * @param {*} reject
 * @returns Object
 */
async function session_get_objects(items, resolve = () => { }, reject = () => { }) {
	try {
		if (!items) {
			console.error("session items can't null")
			reject()
			return false
		}
		chrome.storage.local.get(items, function (res) {
			resolve(res)
		})
	} catch (e) {
		reject(e)
	}
}

/**
 *
 * @param {*} key 删除指定的key
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
async function session_remove(key, resolve = () => { }, reject = () => { }) {
	try {
		if (!key) {
			console.error("session key can't null")
			reject()
			return false
		}
		chrome.storage.local.remove(key, function (res) {
			resolve(res)
		})
	} catch (e) {
		reject(e)
	}
}

async function session_clear(resolve = () => { }, reject = () => { }) {
	try {
		chrome.storage.local.get(items, function (res) {
			resolve(res)
		})
	} catch (e) {
		reject(e)
	}
}
/**
 * 
 * @param {*} resolve 
 * @param {*} reject 
 * @return 获取所有tab页
 */
async function session_get_tabs(resolve = () => { }, reject = () => { }) {
	try {
		chrome.tabs.query({}, function (res) {
			resolve(res)
		})
	} catch (e) {
		reject(e)
	}
}

/**
 *
 * @param {*} object 在同步扩展中批量存储多个key值
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
async function sync_set_objects(object, resolve = () => { }, reject = () => { }) {
	try {
		if (!object) {
			console.error("session object can't null")
			reject()
			return false
		}
		chrome.storage.sync.set(object, function (res) {
			resolve(object)
		})
	} catch (e) {
		reject(e)
	}
}
/**
 *
 * @param {*} items 获取多个key值
 * @param {*} resolve
 * @param {*} reject
 * @returns
 */
async function sync_get_objects(items, resolve = () => { }, reject = () => { }) {
	try {
		if (!items) {
			console.error("session items can't null")
			reject()
			return false
		}
		chrome.storage.sync.get(items, function (res) {
			resolve(res)
		})
	} catch (e) {
		reject(e)
	}
}
/**
 *
 * @param {*} url 获取cookie的域名
 * @param {*} name 获取指定的key
 */
async function get_cookie_name(url, name, resolve = () => { }, reject = () => { }) {
	try {
		chrome.cookies.getAll({ url, name }, (res) => {
			resolve(res[0]?.value)
		})
	} catch (e) {
		reject(e)
	}
}
/**
 * 
 * @param {*} url 与 Cookie 相关联的 URL。如果该 URL 的主机权限没有在清单文件中指定，则这一 API 调用将会失败。
 * @param {*} name 要想删除的 Cookie 名称。
 * @param {*} resolve 
 * @param {*} reject 
 */
async function remove_cookie_name(url, name, resolve = () => { }, reject = () => { }) {
	try {
		chrome.cookies.remove({ url, name }, (res) => {
			resolve(res)
		})
	} catch (error) {
		reject(error)

	}
}
/**
 * 
 * @param {*} url 域名
 * @param {*} name cookie名称
 * @param {*} value cookie值
 * @param {*} resolve 
 * @param {*} reject 
 */
async function set_cookie_name(url, name, value, resolve = () => { }, reject = () => { }) {
	try {
		chrome.cookies.set({ url, name, value }, (res) => {
			resolve(res)
		})
	} catch (error) {
		console.log(error)
		reject(error)
	}
}
let session = {
	get_cookie_name: async function (url, name) {
		return await nano_promise(get_cookie_name, [url, name])()
	},
	get: async function (key, default_value = null) {
		return await nano_promise(session_get, [key, default_value])()
	},
	get_objects: async function (object) {
		return await nano_promise(session_get_objects, [object])()
	},
	get_sync_objects: async function (object) {
		return await nano_promise(sync_get_objects, [object])()
	},
	set: async function (key, value) {
		return await nano_promise(session_set, [key, value])()
	},
	set_objects: async function (object) {
		return await nano_promise(session_set_objects, [object])()
	},
	set_cookie_name: async function (url, name, value) {
		return await nano_promise(set_cookie_name, [url, name, value])()
	},
	set_sync_objects: async function (object) {
		return await nano_promise(sync_set_objects, [object])()
	},
	remove: async function (key) {
		return await nano_promise(session_remove, [key])()
	},
	remove_cookie_name: async function (url, name) {
		return await nano_promise(remove_cookie_name, [url, name])()
	},
	clear: async function () {
		return await nano_promise(session_clear)()
	},
	get_tabs: async function () {
		return await nano_promise(session_get_tabs, [])()
	},
}
export default session
