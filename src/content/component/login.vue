<template>
  <div v-if="isLogin" class="login">
    <div class="monica-login">
      <div class="header-login" @mousedown="move">
        <div class="logo-wrap">
          <div class="logo">
            <img src="~@/assets/images/logo.png" alt="" />
          </div>
          <div class="title">Fiona</div>
        </div>
        <div class="open">
          <div class="seting">
            <span class="icon-guanbi lin" @click="loginClose" />
          </div>
        </div>
      </div>
      <div class="login content">
        登录页面
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    isLogin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // isLogin: false,
    }
  },
  methods: {
    loginClose() {
      this.$parent.isLogin = false
    },
  },
}
</script>
<style lang="less" scoped>
.login {
  .monica-login {
    position: fixed;
    width: 749px;
    height: 583px;
    left: 50%;
    top: 10px;
    margin-left: 0px;
    margin-top: 0px;
    color: #212b36;
    user-select: text;
    text-align: left;
    font-weight: 400;
    background: #ffffff;
    border: 1px solid #e5e8eb;
    box-shadow: 0 8px 16px #919eab29;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    z-index: 5999999;
    overflow: hidden;
    font-size: 14px;
    line-height: normal;
    transform: translateX(-50%);
  }
  .header-login {
    position: relative;
    display: flex;
    align-items: center;
    height: 50px;
    min-height: 50px;
    max-height: 50px;
    border-bottom: 1px solid #f2f2f2;
    padding: 0 16px;
    user-select: none;
    align-items: center;
    justify-content: space-between;
    // padding: 10px;
    z-index: 9999999999;

    .logo-wrap {
      display: flex;

      img {
        width: 22px;
        height: 22px;
      }

      .title {
        font-weight: 600;
        font-size: 16px;
        color: #000;
        margin-left: 10px;
      }
    }

    .open {
      display: flex;
      font-weight: 600;
      font-size: 16px;
      cursor: pointer;

      .icon-btn {
        margin-left: 10px;
      }

      .seting {
        display: flex;
        align-items: center;

        span {
          padding: 4px;
        }

        span:last-child {
          padding: 6px;
        }
      }
    }
  }
}
</style>
