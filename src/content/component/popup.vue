<template>
  <div
    class="overlay"
    :class="{ visible: visible, center: centerFlag }"
    @click.self="close"
  >
    <div class="modal" :class="{ 'modal-center': centerFlag }" @click.stop>
      <div class="header">
        <div class="title">{{ title }}</div>
        <span class="icon-guanbi lin close-btn" @click="close" />
        <!-- <button class="close-btn" @click="close">&#10005;</button> -->
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Title',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    centerFlag: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="less">
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  /* align-items: center; */
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease-out;
  z-index: 999999999;
}

.overlay.visible {
  opacity: 1;
  visibility: visible;
}

.modal {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85%;
  background-color: #fff;
  // padding: 20px;
  border-radius: 5px;
  transform: scale(0.7);
  opacity: 0;
  transition: all 0.3s ease-out;
}
.modal-center {
  position: static;
  width: 350px;
  height: 361px;
  // width: 50%;
  // height: 70%;
}
.center {
  align-items: center;
}
.overlay.visible .modal {
  transform: scale(1);
  opacity: 1;
}

.header {
  width: 100%;
  height: 38px;
  line-height: 38px;
  font-size: 16px;
  color: #0d1117;
  text-align: center;
  font-weight: 600;
  display: flex;
  .title {
    flex: 1;
    display: flex;
    justify-content: center;
  }
}

.close-btn {
  position: absolute;
  top: 13px;
  right: 16px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  font-size: 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #c1c1c1;
  z-index: 2;
}
</style>
