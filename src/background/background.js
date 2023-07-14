import api from '@/api/apis'
import { EventController } from '@/api/eventController'
const eventController = new EventController()

import hotReload from '@/utils/hotReload'
hotReload()

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request, 'request', sender)
  ;(async () => {
    try {
      switch (request.type) {
        case 0: // 发送消息
          const param = {
            messages: request.data.data,
            temperature: 1.2,
            max_tokens: 200,
          }
          const url = '/v3/getChatStream'
          const chat = JSON.stringify(param)
          let content = ''
          eventController.stopFetchEvent()
          eventController.startFetchEvent(
            url,
            chat,
            (res) => {
              res = convertToJSON(res)
              // const data = {
              //   content: JSON.parse(`"${res}"`),
              //   id: sender.tab.id,
              //   role: 'system',
              // }
              // chrome.tabs.sendMessage(sender.tab.id, { code: 'sse', data })

              if (!/\n/.test(res)) {
                content += res
              }
            },
            () => {
              eventController.stopFetchEvent()
              console.log(sendResponse, '结束了')
              // chrome.tabs.sendMessage(sender.tab.id, { code: 'end' })

              const data = {
                content: JSON.parse(`"${content}"`),
                role: 'system',
              }
              sendResponse({ code: 0, data })
            }
          )
          // let res = await api.getChat(param)
          // res = convertToJSON(res)
          // console.log('==11', res)

          // const data = {
          //   content: res,
          //   role: 'system',
          // }
          // sendResponse({ code: 0, data })
          break
        case 'history':
          const historyRes = await api.getHistoryMsg(request.data)
          sendResponse({ code: 'history', msg: '请求超时！' })
          break
        case 'desc':
          const descRes = await api.getAgentDesc({})
          if (descRes.code == 200) {
            sendResponse({ code: 'desc', data: descRes.data })
          }
          break
      }
    } catch (error) {
      console.log(error)
      return sendResponse({ code: -1, msg: '请求超时！' })
    }
  })()
  return true
})
// chrome.action.onClicked.addListener(function (tab) {
//   console.log('扩展图标被单击了！');
// });

function convertToJSON(str) {
  // 通过正则表达式匹配每个data行的内容
  let regex = /"content":"(.*?)"/
  let matchResult = str.match(regex)
  let content = ''
  if (matchResult) {
    content = matchResult[1]
  }
  // console.log(matchResult, 'matchResult', str)
  return content
}
// function convertToJSON(str) {
//   // 通过正则表达式匹配每个data行的内容
//   const regex = /data:\s*(\{.*?\})\s*\n/g
//   let match
//   // const jsonArr = []
//   let content = ''

//   // 遍历所有匹配结果
//   while ((match = regex.exec(str)) !== null) {
//     const obj = JSON.parse(match[1])
//     if ('content' in obj.choices[0].delta) {
//       content += obj.choices[0].delta.content
//     }
//     // 将匹配结果转换为JSON对象，并添加到JSON数组中
//     // jsonArr.push(JSON.parse(match[1]))
//   }

//   return content
// }
