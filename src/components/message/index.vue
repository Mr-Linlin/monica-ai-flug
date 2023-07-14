<template>
  <transition-group name="message" tag="div" class="message-container">
    <div
      v-for="item in message"
      :key="item.id"
      :class="[
        'message',
        item.type,
        { 'is-closed': item.closed, 'is-closing': item.closing },
      ]"
    >
      <div class="message-content">
        <span class="message-text">{{ item.text }}</span>
        <!-- <span class="message-close">&times;</span> -->
      </div>
    </div>
  </transition-group>
</template>

<script>
export default {
  name: 'Message',

  data() {
    return {
      message: [],
    }
  },

  mounted() {
  },

  methods: {
    addMessage(type, text, duration = 3000) {
      const message = {
        id: Date.now(),
        type,
        text,
        closed: false,
        closing: false,
        timer: setTimeout(() => {
          this.closeMessage(message)
        }, duration),
      }

      this.message.push(message)
      message.timer = setTimeout(() => {
        this.closeMessage(message)
      }, duration)
    },
    closeMessage(item) {
      if (item.closed || item.closing) {
        return
      }
      item.closed = true
      item.closing = true
      setTimeout(() => {
        item.closing = false
      }, 1000)
      setTimeout(() => {
        this.removeClosedMessage()
      }, 1000)
    },
    removeClosedMessage() {
      this.message = this.message.filter((item) => !item.closed)
    },
  },
}
</script>

<style scoped>
/* 消息容器样式 */
.message-container {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  max-width: 350px;
  z-index: 99999999999999999999999 !important;
}

/* 单条消息样式 */
.message {
  position: relative;
  margin-bottom: 8px;
  padding: 12px 16px;
  border-radius: 4px;
  cursor: pointer;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: height 0.2s ease-out, opacity 0.2s ease-out;
}

/* 不同类型的消息样式 */
.success {
  border-left: 4px solid #52c41a;
}

.warning {
  border-left: 4px solid #faad14;
}

.info {
  border-left: 4px solid #1890ff;
}

.error {
  border-left: 4px solid #f5222d;
}

/* 关闭按钮的样式 */
.message-close {
  position: absolute;
  top: 50%;
  right: 12px;
  margin-top: -8px;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  opacity: 0.5;
  transition: opacity 0.2s ease-out;
}

/* 已经被关闭的消息的样式 */
.is-closed {
  height: 0 !important;
  opacity: 0 !important;
  padding: 0 !important;
  border: none !important;
  overflow: hidden !important;
}

.is-closing {
  height: 0 !important;
  opacity: 0 !important;
  padding: 0 !important;
  border: none !important;
  overflow: hidden !important;
}

/* 消息进入动画的开始状态 */
.message-enter {
  opacity: 0;
  transform: translateY(16px);
}

/* 消息进入动画的结束状态 */
.message-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* 消息进入动画的过渡效果 */
.message-enter-active {
  transition: all 0.2s ease-out;
}

/* 消息离开动画的开始状态 */
.message-leave {
  opacity: 1;
  transform: translateY(0);
}

/* 消息离开动画的结束状态 */
.message-leave-to {
  opacity: 0;
  transform: translateY(16px);
}

/* 消息离开动画的过渡效果 */
.message-leave-active {
  transition: all 0.2s ease-out;
}
</style>
