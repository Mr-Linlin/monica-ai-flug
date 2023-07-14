<template>
  <div class="my-input">
    <template v-if="type == 'text'">
      <input
        type="text"
        v-model="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="my-input__inner"
      />
    </template>
    <template v-else-if="type == 'textarea'">
      <textarea
        v-model="localValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="my-input__inner my-textarea"
      ></textarea>
    </template>
    <i
      v-if="clearable && localValue != ''"
      class="my-input__clear"
      @click="handleClear"
      >×</i
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      localValue: this.value,
    }
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    clearable: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'text',
    },
  },
  watch: {
    value(newValue) {
      this.localValue = newValue
    },
    localValue(newValue) {
      this.$emit('input', newValue)
    },
  },
  methods: {
    handleClear() {
      this.localValue = ''
    },
  },
}
</script>

<style scoped>
.my-input {
  position: relative;
}

.my-input__inner {
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  box-shadow: unset !important;
  padding: 4px 22px 4px 12px;
  outline: 0;
  font-size: 14px;
  color: #212b36;
  white-space: pre-wrap;
  transition: all 0.2s;
  height: 33px;
  line-height: 33px;
  list-style: none;
}
.my-input__inner:hover {
  border-color: #3872e07a;
}
.my-input__inner:focus {
  border-color: #3872e0;
}
.my-textarea {
  overflow-y: overlay !important;
  border: 1.5px solid #e6eaf2;
  border-radius: 4px;
  box-shadow: unset !important;
  padding: 8px 12px;
  outline: 0;
  font-size: 14px;
  color: #212b36;
  white-space: pre-wrap;
  min-height: 80px;
  line-height: 1.5;
}

.my-input__clear {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 18px;
  color: #666;
  cursor: pointer;
}
</style>
