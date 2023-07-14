export function getCookie(cname) {
	var name = cname + "="
	var ca = document.cookie.split(";")
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim()
		if (c.indexOf(name) == 0) return c.substring(name.length, c.length)
	}
	return ""
}
/**
 *
 * @param {*} objProperty sku信息
 * @param {*} pddPropertyEles 规格详情
 */
export function checkSkuSelected(objProperty, pddPropertyEles) {
	console.log(objProperty, "objProperty")
	let n = 0
	if (pddPropertyEles.length > 0) {
		for (let k = 0; k < objProperty.length; k++) {
			for (let i = 0; i < pddPropertyEles.length; i++) {
				if (pddPropertyEles[i].innerText == objProperty[k].replace(";", "").trim()) {
					n++
				}
			}
		}
	}
	console.log(objProperty.length, n)
	if (objProperty.length != n) {
		window.orderExceptionDes = { type: false, msg: "SKU规格匹配失败" }
	}
}
// 获取sign
export async function getSign() {
	let params = {
		functionName: "GetHeaderSign",
		namespace: "Infrastructure.Utils.HeaderSignByAes",
		params: [
			"PUoNYFwwnlRcn0F",
			'{"clientId":"3eysqpnc9nwryacky8kbug8jebpn5pwb","muid":"undefined","clientSecret":"","plainText":"","username":"undefined","uuid":"0","systemNumber":"PUoNYFwwnlRcn0F","appcode":"damai","version":"1.0.1"}',
			"",
		],
	}
	let response = await window.aiCommonService.InfrastructureModule(params)
	console.log(response)
	if (response.data.ret === 200) {
		return response.data.returnObj
	}
}
/**
 * 图片转base64
 * @param {*} imgUrl 图片地址
 */
export async function getBase64(imgUrl, fileName) {
	return new Promise((resolve, reject) => {
		window.URL = window.URL || window.webkitURL
		var xhr = new XMLHttpRequest()
		xhr.open("get", imgUrl, true)
		// 至关重要
		xhr.responseType = "blob"
		xhr.onload = function () {
			if (this.status == 200) {
				//得到一个blob对象
				var blob = this.response
				console.log(blob, "blobblob")
				// 至关重要
				let oFileReader = new FileReader()
				oFileReader.onloadend = function (e) {
					// 此处拿到的已经是 base64的图片了
					let base64 = e.target.result
					let file = dataURLtoFile(base64, fileName)
					// let file = blobToFile(blob, fileName)
					resolve({ file, code: 0,blob,file })
				}
				oFileReader.readAsDataURL(blob)
			} else {
				reject(new Error(xhr.statusText))
			}
		}
		xhr.onerror = function () {
			reject(new Error(xhr.statusText))
		}
		xhr.send()
	})
}
// 将base64转为file
function dataURLtoFile(dataurl, filename) {
	var arr = dataurl.split(","),
		mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]),
		n = bstr.length,
		u8arr = new Uint8Array(n)
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n)
	}
	return new File([u8arr], filename, { type: mime })
}
//将blob转换为file
function blobToFile(theBlob, fileName) {
	theBlob.lastModifiedDate = new Date()
	theBlob.name = fileName
	return theBlob
}
// 截取url字段信息
export function subUrl() {
	const url = window.location.search
	const thisUrl = new Object()
	let strs = ""
	if (url.indexOf("?") != -1) {
		let str = url.substr(1)
		strs = str.split("&")
		for (let i = 0; i < strs.length; i++) {
			thisUrl[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1])
		}
	}
	return thisUrl
}

// gbk3212
export function GB2312UTF8() {
	this.Dig2Dec = function (s) {
		var retV = 0
		if (s.length == 4) {
			for (var i = 0; i < 4; i++) {
				retV += eval(s.charAt(i)) * Math.pow(2, 3 - i)
			}
			return retV
		}
		return -1
	}
	this.Hex2Utf8 = function (s) {
		var retS = ""
		var tempS = ""
		var ss = ""
		if (s.length == 16) {
			tempS = "1110" + s.substring(0, 4)
			tempS += "10" + s.substring(4, 10)
			tempS += "10" + s.substring(10, 16)
			var sss = "0123456789ABCDEF"
			for (var i = 0; i < 3; i++) {
				retS += "%"
				ss = tempS.substring(i * 8, (eval(i) + 1) * 8)
				retS += sss.charAt(this.Dig2Dec(ss.substring(0, 4)))
				retS += sss.charAt(this.Dig2Dec(ss.substring(4, 8)))
			}
			return retS
		}
		return ""
	}
	this.Dec2Dig = function (n1) {
		var s = ""
		var n2 = 0
		for (var i = 0; i < 4; i++) {
			n2 = Math.pow(2, 3 - i)
			if (n1 >= n2) {
				s += "1"
				n1 = n1 - n2
			} else s += "0"
		}
		return s
	}

	this.Str2Hex = function (s) {
		var c = ""
		var n
		var ss = "0123456789ABCDEF"
		var digS = ""
		for (var i = 0; i < s.length; i++) {
			c = s.charAt(i)
			n = ss.indexOf(c)
			digS += this.Dec2Dig(eval(n))
		}
		return digS
	}
	this.Gb2312ToUtf8 = function (s1) {
		var s = escape(s1)
		var sa = s.split("%")
		var retV = ""
		if (sa[0] != "") {
			retV = sa[0]
		}
		for (var i = 1; i < sa.length; i++) {
			if (sa[i].substring(0, 1) == "u") {
				retV += this.Hex2Utf8(this.Str2Hex(sa[i].substring(1, 5)))
				if (sa[i].length) {
					retV += sa[i].substring(5)
				}
			} else {
				retV += unescape("%" + sa[i])
				if (sa[i].length) {
					retV += sa[i].substring(5)
				}
			}
		}
		return retV
	}
	this.Utf8ToGb2312 = function (str1) {
		var substr = ""
		var a = ""
		var b = ""
		var c = ""
		var i = -1
		i = str1.indexOf("%")
		if (i == -1) {
			return str1
		}
		while (i != -1) {
			if (i < 3) {
				substr = substr + str1.substr(0, i - 1)
				str1 = str1.substr(i + 1, str1.length - i)
				a = str1.substr(0, 2)
				str1 = str1.substr(2, str1.length - 2)
				if (parseInt("0x" + a) & (0x80 == 0)) {
					substr = substr + String.fromCharCode(parseInt("0x" + a))
				} else if (parseInt("0x" + a) & (0xe0 == 0xc0)) {
					//two byte
					b = str1.substr(1, 2)
					str1 = str1.substr(3, str1.length - 3)
					var widechar = (parseInt("0x" + a) & 0x1f) << 6
					widechar = widechar | (parseInt("0x" + b) & 0x3f)
					substr = substr + String.fromCharCode(widechar)
				} else {
					b = str1.substr(1, 2)
					str1 = str1.substr(3, str1.length - 3)
					c = str1.substr(1, 2)
					str1 = str1.substr(3, str1.length - 3)
					var widechar = (parseInt("0x" + a) & 0x0f) << 12
					widechar = widechar | ((parseInt("0x" + b) & 0x3f) << 6)
					widechar = widechar | (parseInt("0x" + c) & 0x3f)
					substr = substr + String.fromCharCode(widechar)
				}
			} else {
				substr = substr + str1.substring(0, i)
				str1 = str1.substring(i)
			}
			i = str1.indexOf("%")
		}

		return substr + str1
	}
}
