import MarkdownIt from 'markdown-it'
import LButton from '@/components/button/index.vue'
import LTab from '@/components/Tabs/index.vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'
import Login from '../component/login'
import Popup from '../component/popup.vue'
import promptPopup from '../component/promptPopup.vue'
import LInput from '@/components/input/input.vue'
import Radio from '@/components/radio/index'
import Message from '@/components/message/index'
export default {
  components: {
    LButton,
    LTab,
    Login,
    Popup,
    promptPopup,
    LInput,
    Radio,
    Message,
  },
  data() {
    return {
      isOpen: true,
      isPopup: false, //聊天窗口
      writer: false, //打字机效果
      isLogin: false, //打开登录窗口
      isModel: false, //打开弹出层
      dialogVisible: false, //打开添加快捷语窗口
      chatValue: '',
      text: '', // 当前已经打印的文本内容
      index: 0, // 当前已经打印的字符索引
      speed: 1000, // 打印速度，单位为毫秒
      options: [
        {
          label: 'Insert into input',
          value: 1,
        },
        {
          label: 'Send directly',
          value: 2,
        },
      ],
      messageList: [
        {
          role: 'system',
          content: '你好，我是一个智能AI，你可以向我问些问题。',
        },
      ],
      prompt: {
        name: '',
        content: '',
        selected: 1,
      },
      md: MarkdownIt({
        linkify: true, //增强URL和email识别
        html: true,
        typographer: true,
        highlight: function (str, lang) {
          //使用highlight.js库对代码块语法高亮
          if (lang && hljs.getLanguage(lang)) {
            try {
              return hljs.highlight(lang, str).value
            } catch (__) {}
          }
          return '' //使用默认的转义功能
        },
      }),
      loading: false,
      isRight: false,
      prompList: ['Explain', 'Translate to English', 'Rewrite'],
      typeList: ['聊天', '写作', '绘画'],
      tabType: 0, //tab栏切换
      // 浏览器伸缩
      isResizing: false,
      lastDownX: 0,
      lastDownY: 0,
      minWidth: 750,
      minHeight: 350,
      maxWidth: window.innerWidth,
      maxHeight: window.innerHeight - 400,
      width: 750,
      left: 577,
      maxLeft: 577,
      height: 350,
      replyMsg: '',
      showReplyMsg: '',
      showReplyInter: null,
    }
  },
  watch: {
    replyMsg: {
      handler() {
        this.showReplyContent()
      },
    },
    messageList: {
      handler(newD, oldD) {
        this.$nextTick(() => {
          const content = document.querySelector('.input-content') // 获取需要滚动的元素
          content.scrollTop = content.scrollHeight // 将scrollTop设置为scrollHeight，即滚动到底部
        })
      },
      deep: true,
    },
    isRight: {
      handler(newD, oldD) {
        if (this.isRight) {
          document.body.style.width = 'calc(100% - 420px)'
        } else {
          document.body.style.width = '100%'
        }
      },
      deep: true,
    },
    text: {
      handler(newD, oldD) {
        // console.log(newD, '=====textf')
      },
      deep: true,
    },
  },
  directives: {
    typeWriter: {
      //打字机效果
      inserted: async (el, binding, vnode) => {
        const _this = vnode.context //获取Vue实例对象
        const text = el.innerText
        let index = 0
        let isScrolling = false
        let time = 10
        _this.text = ''
        el.innerText = ''
        _this.writer = true
        const pushCharacter = async () => {
          if (index < text.length && _this.writer) {
            el.innerText += text.charAt(index)
            _this.text = el.innerText
            index++
            const content = document.querySelector('.input-content') // 获取需要滚动的元素
            content.scrollTop = content.scrollHeight // 将scrollTop设置为scrollHeight，即滚动到底部

            if (!isScrolling && el.offsetHeight < el.scrollHeight) {
              isScrolling = true
              el.scrollTop = 0
            }

            if (isScrolling) {
              el.scrollTop += 1

              if (el.scrollTop + el.offsetHeight < el.scrollHeight) {
                setTimeout(pushCharacter, time)
              } else {
                isScrolling = false
              }
            } else {
              setTimeout(pushCharacter, time)
            }
          }
          if (index == text.length) {
            _this.writer = false
            _this.$nextTick(() => {
              const pres = document.querySelectorAll('pre')
              pres.forEach((pre) => {
                const copys = pre.querySelectorAll('.copy-btn')
                if (copys.length == 0) {
                  const div = document.createElement('div')
                  div.classList.add('copy-header')
                  const span = document.createElement('span')
                  span.innerHTML = '复制'
                  // span.setAttribute('v-copy-text', '');
                  span.addEventListener('click', () => {
                    const code = pre.querySelector('code')
                    _this.copyText(code.innerText)
                  })
                  span.classList.add('copy-btn', 'icon-fuzhi1', 'lin')
                  div.appendChild(span)
                  const referenceNode = pre.firstChild // 获取父节点的第一个子节点
                  pre.insertBefore(div, referenceNode) // 插入新的子节点到父节点的第一个子节点之前
                  // pre.appendChild(span)
                }
              })
              const content = document.querySelector('.input-content') // 获取需要滚动的元素
              content.scrollTop = content.scrollHeight // 将scrollTop设置为scrollHeight，即滚动到底部
            })
          }
        }

        pushCharacter()
      },
    },
    hoverCopy: {
      //显示复制按钮
      bind: (el, binding, vnode) => {
        let chatItem = null
        let copyText = null
        let content = null
        el.addEventListener('mouseenter', function () {
          chatItem = el.parentNode
          copyText = chatItem.querySelector('.copy-text')
          content = chatItem.querySelector('.system-left')
          if (content) {
            copyText.style.display = 'block'
            // 获取 chat-content 和 copy-text 元素的位置信息
            const chatRect = content.getBoundingClientRect()
            const copyRect = copyText.getBoundingClientRect()
            // console.log(chatRect, copyRect, copyText.width);
            copyText.style.bottom = `-${copyRect.height}px` // 4px 是偏移量
            copyText.style.left = chatRect.width - copyRect.width + 'px' // 或使用 left
          }
          // return chatRect.height + 4; // 4px 是偏移量
        })
        el.addEventListener('mouseleave', function () {
          if (content) {
            copyText.addEventListener('mouseleave', function () {
              copyText.style.display = 'none'
            })
            setTimeout(() => {
              copyText.style.display = 'none'
            }, 3000)
          }
        })
      },
    },
    startResize: {
      //伸缩窗口
      bind: (el, binding, vnode) => {
        let startY = 0 // 记录鼠标按下时的纵坐标
        let startHeight = 0 // 记录元素初始高度
        let mouseMoveHandler = null // mousemove 事件监听器
        let mouseUpHandler = null // mouseup 事件监听器
        let _this = vnode
        el.addEventListener('mousedown', (e) => {
          switch (binding.value) {
            case 'bottom':
              startY = e.clientY
              startHeight = el.clientHeight
              mouseMoveHandler = function (e) {
                const deltaY = e.clientY - startY
                const parent = el.parentNode
                const content = parent.querySelector('.input-content')
                // 获取 chat-content 和 copy-text 元素的位置信息
                const chatRect = content.getBoundingClientRect()
                const parentRect = parent.getBoundingClientRect()
                let height = chatRect.height + deltaY
                if (height < _this.context.minHeight) {
                  height = _this.context.minHeight
                }
                const maxHeight =
                  window.innerHeight -
                  (parentRect.height - chatRect.height + 20)
                console.log(parentRect.height, '==', maxHeight)
                if (height > maxHeight) {
                  height = maxHeight
                }
                content.style.height = `${height}px`
                // content.style.transform = `scaleY(${height / startHeight})`;
              }
              document.addEventListener('mousemove', mouseMoveHandler)
              // 监听 mouseup 事件
              mouseUpHandler = () => {
                document.onmousemove = null
                document.onmouseup = null
              }
              document.addEventListener('mouseup', mouseUpHandler)
              break
            case 'left':
              console.log('按住左方')
              break
            case 'right':
              console.log('按住右方')
              break
            case 'top':
              console.log('按住上方')
              break
          }
        })
      },
    },
  },
  created() {
    // document.addEventListener('mousemove', this.resizeTop)
    document.addEventListener('mousemove', this.resizeBottom)
    document.addEventListener('mousemove', this.resizeLeft)
    document.addEventListener('mousemove', this.resizeRight)
    document.addEventListener('mouseup', this.stopResize)
  },
  destroyed() {
    // document.removeEventListener('mousemove', this.resizeTop)
    document.removeEventListener('mousemove', this.resizeBottom)
    document.removeEventListener('mousemove', this.resizeLeft)
    document.removeEventListener('mousemove', this.resizeRight)
    document.removeEventListener('mouseup', this.stopResize)
  },
  mounted() {
    this.getMsg()
  },
  methods: {
    async getMsg() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // console.log(request, 'request')
        switch (request.code) {
          case 'sse':
            this.replyMsg += request.data.content
            console.log(this.replyMsg, request.data)
            break
          case 'end':
            this.replyMsg = ''
            this.showReplyMsg = ''
            clearInterval(this.showReplyInter)
            this.showReplyInter = null
            console.log(this.replyMsg, 'onClose')
            break
        }
        if (request.popupClicked) {
          this.isPopup = request.popupClicked
          if (this.isRight) {
            document.body.style.width = 'calc(100% - 420px)'
          }
          // 在此处添加处理popup图标点击的代码
        }
      })
      hljs.initHighlightingOnLoad()
      // 获取窗口宽高
      // this.$nextTick(() => {
      //   this.width = this.$el.offsetWidth
      //   this.height = this.$el.offsetHeight
      // })
    },
    // 切换tab栏
    tabStatus(val) {
      console.log(val, 'chat')
      this.tabType = val
    },
    copyEvent(text) {
      text = text.replace(/<\/?[^>]+(>|$)/g, '')
      this.copyText(text)
    },
    // 复制文本
    copyText(text) {
      // const text = event.target.innerText
      navigator.clipboard
        .writeText(text)
        .then(() => {
          // alert('复制成功')
          this.$refs.message.addMessage('success', '复制成功')
        })
        .catch(() => {
          console.error('复制文本失败')
        })
    },
    // 停止ai
    stopMsg() {
      // console.log(this.text, 'typewriter');
      this.writer = false
      const index = this.messageList.length - 1
      this.messageList[index].content = this.md.render(this.text)
      const content = document.querySelector('.input-content') // 获取需要滚动的元素
      content.scrollTop = content.scrollHeight // 将scrollTop设置为scrollHeight，即滚动到底部
    },
    // 去登录
    onLogin() {
      this.isLogin = true
      this.isPopup = false
    },
    // 关闭弹出层
    popupClose() {
      this.isModel = false
      this.dialogVisible = false
      this.prompt = {
        name: '',
        content: '',
        selected: 1,
      }
    },
    // 新建聊天
    newBuilt() {
      console.log('测试')
      this.messageList = [
        {
          role: 'system',
          content: '你好，我是一个智能AI，你可以向我问些问题。',
        },
      ]
    },
    // 关闭主界面
    close() {
      this.isPopup = false
      if (!this.isRight) {
        document.body.style.width = '100%'
      }
    },
    // 发送消息
    async handleEnter(event) {
      if (event.keyCode == 13) {
        this.messageList.push({
          role: 'user',
          content: this.chatValue,
        })
        const param = {
          data: this.messageList,
        }
        this.chatValue = ''
        this.loading = true
        this.sendMsg(param)
        event.preventDefault()
      } else if (event == 14) {
        this.messageList.push({
          role: 'user',
          content: this.chatValue,
        })
        // this.messageList.push({
        //   role: 'system',
        //   content: '',
        // })
        this.chatValue = ''
      }
    },
    savePrompt() {
      if (!this.prompt.name || !this.prompt.content) {
        this.$refs.message.addMessage('warning', '标题和内容不能为空')
      }
      console.log(this.prompt, 'prompt')
    },
    // 修改prompt
    editRow(row) {
      console.log(row)
      this.prompt = {
        id: row.id,
        name: row.name,
        content: row.content,
        selected: row.status,
      }
      this.dialogVisible = true
    },
    // 延时器
    async delay(time) {
      return new Promise((resolve) => {
        const timeId = setTimeout(() => {
          clearTimeout(timeId)
          resolve(true)
        }, time)
      })
    },
    // 拖动窗口
    move(e) {
      if (this.isRight) {
        return
      }
      e.stopPropagation()
      const odiv = document.querySelector('.main-wrap') // 获取目标元素
      // 算出鼠标相对元素的位置
      const disX = e.clientX - odiv.offsetLeft
      const disY = e.clientY - odiv.offsetTop
      document.onmousemove = (e) => {
        // 鼠标按下并移动的事件
        // 用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
        let left = e.clientX - disX
        let top = e.clientY - disY

        // 获取浏览器可视范围
        const clientWidth =
          document.documentElement.clientWidth || document.body.clientWidth
        const clientHeight =
          document.documentElement.clientHeight || document.body.clientHeight

        // 获取元素的宽高
        const elemWidth = odiv.offsetWidth
        const elemHeight = odiv.offsetHeight

        // 判断元素是否超出浏览器可视范围，如果超出则设置为边界值
        if (left < 0) {
          left = 0
        } else if (left + elemWidth > clientWidth) {
          left = clientWidth - elemWidth
        }
        if (top < 0) {
          top = 0
        } else if (top + elemHeight > clientHeight) {
          top = clientHeight - elemHeight
        }

        // 绑定元素位置到positionX和positionY上面
        this.positionX = top
        this.positionY = left

        // 移动当前元素
        odiv.style.left = left + 'px'
        odiv.style.top = top + 'px'
      }
      document.onmouseup = (e) => {
        document.onmousemove = null
        document.onmouseup = null
      }
    },
    showReplyContent() {
      // console.log(
      //   this.messageList[this.messageList.length - 1].content,
      //   ' this.messageList[this.messageList.length - 1].content'
      // )
      // this.showReplyInter = setInterval(() => {
      //   if (this.showReplyMsg.length < this.replyMsg.length) {
      //     this.showReplyMsg = this.replyMsg.substring(
      //       0,
      //       this.showReplyMsg.length + 1
      //     )
      //     this.messageList[this.messageList.length - 1].content =
      //       this.showReplyMsg
      //     // this.scrollEnd()
      //   }
      // }, 50)
      if (!this.replyMsg) return
      const originalValue = this.replyMsg
      let length = originalValue.length
      let index = this.messageList[this.messageList.length - 1].content.length // 从已经显示的部分长度开始
      let currentLength = length // 用于判断 replyMsg 是否发生变化

      const typingInterval = setInterval(() => {
        if (index <= length) {
          if (currentLength === this.replyMsg.length) {
            this.messageList[this.messageList.length - 1].content =
              originalValue.substr(0, index)
            index++
          } else {
            const newContent = this.replyMsg.substr(currentLength)
            // console.log(newContent, 'newContent')
            this.messageList[this.messageList.length - 1].content += newContent
            currentLength = this.replyMsg.length
            length = currentLength // 更新 length 为新的 replyMsg 的长度
            index =
              this.messageList[this.messageList.length - 1].content.lengthh // 更新 index 为已显示内容的长度
          }
        } else {
          clearInterval(typingInterval)
        }
      }, 10)
      console.log(this.messageList)
    },
    scrollEnd() {
      const scrollDom = document.querySelector('.input-content')
      if (scrollDom.scrollHeight > scrollDom.clientHeight) {
        // 设置滚动条到最底部
        setTimeout(function () {
          // 设置滚动条到最底部
          scrollDom.scrollTop = scrollDom.scrollHeight
          scrollDom.style.opacity = 1
        }, 100)
      }
    },
    /**
     * @param data  需要发送的数据
     * @param type 发送信息的类型
     * @param {*} msg 备注信息
     */
    sendMsg(data, type = 0, msg = '') {
      const param = {
        data,
        type,
        msg,
      }
      chrome.runtime.sendMessage(param, async (response) => {
        console.log(response, '----------------------')
        switch (response.code) {
          case 0:
            //初始化MarkdownIt
            // const md =replyMsg
            if (!response.data.content) {
              this.loading = false
              return ''
            }
            // this.replyMsg += response.data.content
            // console.log(this.replyMsg, '=======')
            //替换部分HTML标记
            response.data.content = this.md.render(response.data.content)
            this.messageList.push(response.data)
            this.writer = true
            this.loading = false
            // 在一定时间后结束打字机效果
            break
          case -1:
            const param = {
              role: 'system',
              content: response.msg,
            }
            this.messageList.push(param)
            this.loading = false

            break
        }
        if (!chrome.runtime.lastError) {
          // console.log(response.specs, "上报")
        }
      })
    },
    // 封装检查操作次数是否超过限制的函数
    async checkLimit() {
      const today = new Date().toDateString()
      const obj = {
        lastDate: '',
        usageCount: '',
      }
      const data = await session.get_objects(obj)
      // 如果没有存储记录，说明是第一次使用该插件
      if (Object.keys(data).length === 0) {
        // 初始化记录，第一次使用默认为 5 次
        await session.set_objects({ lastDate: today, usageCount: 10 })
        return true
      } else {
        const lastDate = data.lastDate
        const usageCount = data.usageCount
        // 如果上一次操作的日期与当前日期不同，则重置为 5 次
        if (lastDate !== today) {
          await session.set_objects({ lastDate: today, usageCount: 5 })
          return true
        } else {
          // 如果次数已经用完，返回 false
          if (usageCount < 1) {
            return false
          } else {
            return true
          }
        }
      }
    },
    // 控制浏览器四个方向的伸缩功能
    startResize(direction, e) {
      this.isResizing = true
      this.lastDownX = e.clientX
      this.lastDownY = e.clientY
      this.direction = direction
      e.preventDefault()
    },
    resizeTop(e) {
      if (!this.isResizing || this.direction !== 'top') {
        return
      }

      let height = this.height + (this.lastDownY - e.clientY)

      if (height < this.minHeight) {
        height = this.minHeight
      }

      if (height > this.maxHeight) {
        height = this.maxHeight
      }

      this.height = height

      this.lastDownY = e.clientY
    },
    resizeBottom(e) {
      if (!this.isResizing || this.direction !== 'bottom') {
        return
      }

      let height = this.height + (e.clientY - this.lastDownY)

      if (height < this.minHeight) {
        height = this.minHeight
      }
      const main = document.querySelector('.main-wrap')
      const content = main
        .querySelector('.input-content')
        .getBoundingClientRect()
      const parentRect = main.getBoundingClientRect()
      // console.log(height, );
      const maxHeight =
        window.innerHeight -
        (parentRect.height - content.height + parentRect.top)
      if (height > maxHeight) {
        height = maxHeight
      }
      this.height = height

      this.lastDownY = e.clientY
    },
    resizeLeft(e) {
      if (!this.isResizing || this.direction !== 'left') {
        return
      }

      let width = this.width + (this.lastDownX - e.clientX)
      if (width < this.minWidth) {
        width = this.minWidth
      }
      const main = document.querySelector('.main-wrap')
      const parentRect = main.getBoundingClientRect()
      this.left = e.clientX
      if (this.left > 577) {
        this.left = 577
      }
      const maxHeight = window.innerWidth - (parentRect.left + 20)
      // console.log(window.innerWidth, parentRect, maxHeight);
      if (width > maxHeight) {
        width = maxHeight
      }
      this.width = width

      this.lastDownX = e.clientX
    },
    resizeRight(e) {
      if (!this.isResizing || this.direction !== 'right') {
        return
      }

      let width = this.width + (e.clientX - this.lastDownX)

      if (width < this.minWidth) {
        width = this.minWidth
      }

      const main = document.querySelector('.main-wrap')
      const parentRect = main.getBoundingClientRect()
      // console.log(e.clientX, this.lastDownX);
      // console.log(parentRect);
      const maxHeight = window.innerWidth - (parentRect.left + 10)
      // // console.log(window.innerWidth, parentRect, maxHeight);
      if (width > maxHeight) {
        width = maxHeight
      }

      this.width = width

      this.lastDownX = e.clientX
    },
    stopResize() {
      this.isResizing = false
    },
  },
}
