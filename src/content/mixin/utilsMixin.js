export default {
  components: {},
  data() {
    return {

    }
  },
  methods: {
    /**
       * @param data  需要发送的数据
       * @param type 发送信息的类型 history:获取历史对话
       * @param {*} msg 备注信息
       */
    sendMessage(data, type = 0, msg = '') {
      const param = {
        data,
        type,
        msg,
      }
      chrome.runtime.sendMessage(param, async (response) => {
        console.log(response, '----------------------')
        switch (response.code) {
          case 'history':
            break
          case "desc":
            // console.log(response.data);
            this.actionMenus = response.data.head_desc_list
            this.$nextTick(() => {
              this.popupHeight = this.$refs.popup.clientHeight
            })
            break
        }
        if (!chrome.runtime.lastError) {
          // console.log(response.specs, "上报")
        }
      })
    },
    //  节流
    throttle(fn, wait) {
      let timerId = null;
      let lastTime;

      function throttled(...args) {
        const now = new Date().getTime();
        if (!lastTime || (now - lastTime >= wait)) {
          // 如果无定时器或定时器已经过去了设定的等待时间，则可以立即执行
          fn.apply(this, args);
          lastTime = now;
        } else if (!timerId) {
          // 如果当前定时器已经被设置，那就等待定时器时间结束之后再次执行
          timerId = setTimeout(() => {
            timerId = null;
            lastTime = new Date().getTime();
            fn.apply(this, args);
          }, wait - (now - lastTime));
        }
      }

      return throttled;
    }

  }
}