<template>
  <div class="custom-radio-group">
    <label
      v-for="option in options"
      :key="option.value"
      class="custom-radio-wrapper"
      :class="{ checked: option.value == curValue, disabled: option.disabled }"
    >
      <span class="custom-radio">
        <input
          type="radio"
          name="radio-group"
          class="custom-radio-input"
          :value="option.value"
          :checked="option.value == curValue"
          v-model="curValue"
          :disabled="option.disabled"
          @change="handleChange($event, option)"
        />
        <span class="custom-radio-inner"></span>
      </span>
      <span>{{ option.label }}</span>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    value: {
      type: [String, Number, Boolean],
      default: '',
    },
  },
  data() {
    return {
      curValue: this.value,
    }
  },
  methods: {
    handleChange(event, option) {
      if (!option.disabled) {
        this.$emit('input', event.target.value)
        this.$emit('change')
      }
    },
  },
}
</script>

<style scoped>
.custom-radio-group {
  display: flex;
  font-size: 12px;
}

.custom-radio-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  margin-right: 10px;
  cursor: pointer;
  color: #555;
}

.custom-radio {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  margin-right: 8px;
  margin-top: -3px;
  transition: all 0.3s;
}

.custom-radio-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.custom-radio-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transform: translate(-50%, -50%) scale(0);
  border-color: #3872e0;
  background-color: #3872e0;
  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46);
}

.custom-radio-wrapper.checked .custom-radio-inner {
  transform: translate(-50%, -50%) scale(1);
}

.custom-radio-wrapper.disabled {
  cursor: not-allowed;
  color: #ccc;
}

.custom-radio-wrapper.disabled .custom-radio {
  border-color: #ccc;
}

.custom-radio-wrapper:hover:not(.disabled) .custom-radio {
  border-color: #1890ff;
}
</style>
