<template>
  <div class="prompts">
    <l-button ref="btn" class="prompts-btn" @click="togglePopup">{{
      text
    }}</l-button>
    <div
      v-show="showPopup"
      class="prompts-popup"
      ref="popup"
      :style="{ top: popupTop, left: popupLeft }"
    >
      <div class="header-strcdk">
        <span class="title">My Prompts</span>
        <span class="add icon-icon_tianjia lin" @click="addPrompt"></span>
      </div>
      <div class="content">
        <div class="prompt-menu">
          <div
            v-for="(item, index) in actionMenus"
            :key="index"
            class="menu-item"
          >
            <div class="action-btn">::</div>
            <div class="label">{{ item.status_text }}</div>
            <div class="edit lin icon-xiugai" @click="edit(item)"></div>
          </div>
        </div>
      </div>
    </div>
    <div v-show="showPopup" class="prompts-backdrop" @click="closePopup" />
  </div>
</template>

<script>
import LButton from '@/components/button/index.vue'
import commonMixin from '../mixin/utilsMixin'

export default {
  components: {
    LButton,
  },
  mixins: [commonMixin],
  props: {
    text: {
      type: String,
      default: 'Prompts',
    },
  },
  data() {
    return {
      shortcut: '',
      response: '',
      showPopup: false,
      buttonRect: null,
      popupHeight: 0,
      actionMenus: [],
    }
  },
  computed: {
    popupTop() {
      if (this.buttonRect) {
        console.log(this.popupHeight, '=====', this.buttonRect.clientTop)
        return `${this.buttonRect.clientTop - this.popupHeight}px`
      } else {
        return ''
      }
    },
    popupLeft() {
      if (this.buttonRect) {
        return `${
          this.buttonRect.offsetLeft + this.buttonRect.clientWidth / 2 - 37
        }px`
      } else {
        return ''
      }
    },
  },
  methods: {
    async togglePopup() {
      this.showPopup = !this.showPopup
      // 获取智能体
      const param = {
        agent_id: 2,
      }
      this.sendMessage(param, 'desc')
      if (this.showPopup) {
        this.buttonRect = this.$refs.btn.$el
        this.$nextTick(() => {
          this.popupHeight = this.$refs.popup.clientHeight
        })
      }
    },
    addPrompt() {
      // 将快捷语添加到应用程序中
      this.showPopup = false
      this.$parent.dialogVisible = true
    },
    edit(row) {
      this.showPopup = false
      this.$emit('editRow', row)
    },
    closePopup() {
      this.showPopup = false
    },
  },
}
</script>

<style scoped lang="less">
.prompts-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}
.prompts-btn {
  position: relative;
}

// .prompts-popup {
//   position: absolute;
//   /* top: -25px; */
//   /* padding: 10px; */
//   padding-bottom: 5px;
//   overflow-y: overlay !important;
//   z-index: 999999999999999999;
//   min-width: 165px;
//   max-width: 220px;
//   max-height: 250px;
//   display: flex;
//   flex-direction: column;
//   font-size: 12px;
//   background: #fff;
//   box-shadow: 0 8px 16px #919eab29;
//   border-radius: 5px;
//   border: 1px solid #e5e8eb;
// }
.prompts-popup {
  position: absolute;
  padding-bottom: 5px;
  overflow-y: overlay !important;
  z-index: 999999999999999999;
  min-width: 165px;
  max-width: 220px;
  max-height: 250px;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  background: #fff;
  box-shadow: 0 8px 16px #919eab29;
  border-radius: 5px;
  border: 1px solid #e5e8eb;
  .header-strcdk {
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    padding: 0 5px 0 8px;
    color: #637381;
    display: flex;
    font-size: 13px;
    user-select: none;
    .title {
      flex: 1;
    }
    .add {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
  }
  .content {
    flex: 1;
    min-height: 0;
    display: flex;
    .prompt-menu {
      width: 100%;
      position: relative;
      padding-bottom: 5px;
      overflow-y: overlay !important;
      .menu-item {
        cursor: pointer;
        font-size: 13px;
        width: 100%;
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
        padding: 0 10px;
        background: #fff;
        color: #333;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        align-items: flex-start;
        gap: 2px;
        .action-btn {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100%;
          color: #888;
        }
        .label {
          flex: 1;
          cursor: pointer;
          user-select: none;
          min-width: 0;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        .edit {
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          height: 100%;
          color: #888;
        }
      }
      .menu-item:hover {
        background-color: #3366ff14;
      }
    }
  }
}

.prompts-popup.show {
  display: block;
}
</style>
