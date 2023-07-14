<template>
  <div id="app">

  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  mounted() {
    this.sendMsg()
  },
  methods: {
    sendMsg() {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { popupClicked: true });
      });
    }
  }
};
</script>

<style lang="less" scoped>
#app {}
</style>
