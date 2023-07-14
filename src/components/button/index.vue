<template>
  <button
    class="zt-button"
    :class="[type ? 'zt-button-' + type : '']"
    @click="handleClick"
  >
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: { type: String },
  methods: {
    handleClick(e) {
      this.$emit('click', e)
    },
  },
}
</script>

<style lang="less" scoped>
.zt-button {
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
	border: 1px solid rgba(56,114,224,.48);
  color: #3872e0;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: 0.1s;
  font-weight: 500;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  font-size: 12px;
  height: 26px;
  padding: 0 6px;
  border-radius: 4px;
}

.zt-button:focus,
.zt-button:hover {
  color: #3872e0;
  background: #eff3ff;
}

.zt-button:active {
  color: #3872e0;
  border-color: #3872e0;
  outline: none;
}
.zt-button-primary {
  color: #fff;
  background: #3872e0;
  border: 1px solid #3872e0;
}

.zt-button--primary:hover {
  background: #3469ce;
  border-color: #3469ce;
  color: #fff;
}
.zt-button-success {
  color: #fff;
  background-color: rgb(103, 194, 58);
  border-color: rgb(103, 194, 58);
}

.zt-button-success:focus,
.zt-button--success:hover {
  background: rgb(103, 194, 58);
  border-color: rgb(103, 194, 58);
  color: #fff;
}
.zt-button-danger {
  color: #fff;
  background-color: rgb(245, 108, 108);
  border-color: rgb(245, 108, 108);
}

.zt-button-danger:focus,
.zt-button--danger:hover {
  background: rgb(245, 108, 108);
  border-color: rgb(245, 108, 108);
  color: #fff;
}
.zt-button {
  margin-left: 10px;
}
</style>
