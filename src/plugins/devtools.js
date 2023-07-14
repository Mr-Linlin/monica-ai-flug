chrome.devtools.panels.create("MyPanel", "img/jidan.png", "mypanel.html", function (panel) {
	console.log(panel, "自定义面板创建成功！") // 注意这个log一般看不到
})

chrome.devtools.network.onRequestFinished.addListener(function (request) {
	if (request.request.url.includes("weixin://wap/pay")) {
		console.log(request, "request")
		chrome.runtime.sendMessage({
			type: 11,
			tabId: chrome.devtools.inspectedWindow.tabId,
			url: request.request.url,
		})
	}
})
