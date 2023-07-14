// import  {request}  from "../request"
import FetchRequest from "../fetch"
const request = new FetchRequest()
export default {
  // getChat: (data) => request.post('/v2-test/getChat', data), //测试
  getChat: (data) => request.postJson('/v3/getChatStream', data), //测试
  getHistoryMsg: (data) => request.get('/api/Chatmessage/getMsgList', data), //获取历史对话
  getAgentDesc: (data) => request.get('/api/Chatagent/getAgentDesc', data), //获取随机智能体
  login: (data) => request.post('/v2/login', data), //测试

}
