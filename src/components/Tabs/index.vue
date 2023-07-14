<template>
  <div class="tab-wrap">
    <div v-for="(item, index) in data" :key="item" class="tab-item" :class="{ active: activeIndex === index }"
      @click="onTab(index)">
      {{ item }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      activeIndex: 0,

    }
  },
  methods: {
    onTab(val) {
      this.activeIndex = val
      this.$emit('tabStatus', val)
    },
  },
}
</script>
<style scoped lang="less">
.tab-wrap {
  display: flex;

  .tab-item {
    padding: 10px 15px;
    cursor: pointer;
  }

  .active {
    color: rgb(64, 158, 255);
    border-bottom: 2px solid rgb(64, 158, 255);
  }
}
</style>
