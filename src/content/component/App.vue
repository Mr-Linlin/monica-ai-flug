<template>
  <div id="contentApp">
    <div
      v-if="isPopup"
      class="main-wrap"
      :class="{ 'main-right': isRight == true }"
      :style="{ left: `${left}px`, width: `${width}px` }"
    >
      <div
        class="header-wrap"
        @mousedown="move"
        :style="isRight == true ? { cursor: 'default' } : ''"
      >
        <div class="logo-wrap">
          <div class="logo">
            <img src="~@/assets/images/logo.png" alt="" />
          </div>
          <div class="title">Fiona</div>
        </div>
        <div class="open">
          <div class="seting">
            <!-- <span
              class="icon-sidebarcebianlan lin"
              @click="isRight = !isRight"
            ></span> -->
            <span class="icon-set lin" @click="onLogin"></span>
            <span class="icon-guanbi lin" @click="close"></span>
          </div>
        </div>
      </div>
      <div
        class="product-form-content"
        :class="{ 'product-content': isRight == true }"
        :style="isRight == true ? { height: '100%' } : ''"
      >
        <div class="promp-box" v-if="isRight">
          <div class="item-box" v-for="item in prompList" :key="item">
            <l-button>{{ item }}</l-button>
          </div>
        </div>
        <l-tab :data="typeList" @tabStatus="tabStatus" />
        <div
          v-if="tabType == 0"
          class="input-content"
          :class="{ 'form-content': isRight == true }"
          :style="{ height: `${height}px` }"
        >
          <div
            class="chat-item"
            v-for="(item, index) in messageList"
            :key="index"
            ref="chatItem"
            :class="{ 'chat-left': item.role == 'system' }"
          >
            <div class="copy-text" v-show="item.role == 'system'">
              <span
                class="icon-fuzhi1 lin"
                @click="copyEvent(item.content)"
              ></span>
            </div>
            <div
              v-hover-copy
              class="chat-content"
              :class="{ 'system-left': item.role == 'system' }"
            >
              <span
                v-if="
                  index == messageList.length - 1 &&
                  item.role == 'system' &&
                  writer
                "
                class="typewriter"
                v-type-writer
                v-html="item.content"
              ></span>
              <span v-else>
                <span v-if="item.role == 'user'">{{ item.content }}</span>
                <span v-else v-html="item.content"></span>
              </span>
              <!-- <span
                v-else
                class="typewriter"
                v-type-writer
                v-html="item.content"
              ></span> -->
            </div>
          </div>
          <div v-if="loading" class="monica-loader">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
        <div v-if="tabType == 1" class="pdf-content">PDF</div>
        <div v-if="tabType == 2" class="url-content">URL</div>

        <div v-show="writer" class="stop-box">
          <l-button class="btn" @click="stopMsg">Stop responding</l-button>
        </div>
        <div class="input-panel">
          <div class="toolbar">
            <div class="lt-btn">
              <l-button type="primary" @click="newBuilt">New Chat</l-button>
              <l-button @click="isModel = true">History</l-button>
              <prompt-popup text="Prompts" @editRow="editRow" />
              <!-- <l-button @click="dialogVisible = true">Prompts</l-button> -->
            </div>
          </div>
          <div class="input-box">
            <div class="input-t">
              <textarea
                v-model.trim="chatValue"
                placeholder="请输入你的问题"
                cols="30"
                rows="2"
                @keydown="handleEnter($event)"
              />
            </div>
            <div class="input-toolbar">
              <div class="input-work">
                {{ chatValue.length > 0 ? chatValue.length : 0 }}/2000
              </div>
              <div class="input-msg-btn" @click="handleEnter(14)">
                <img src="../../assets/images//send.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <popup
        :visible="isModel"
        title="Conversation History"
        @close="popupClose"
      >
        Conversation History
      </popup>
      <popup
        :visible="dialogVisible"
        title="New Prompt"
        :center-flag="true"
        @close="popupClose"
      >
        <div class="prompt-content">
          <div class="item-tag">
            <div class="label">Name</div>
            <div class="input-info">
              <l-input
                v-model="prompt.name"
                placeholder="请输入"
                :clearable="true"
              />
            </div>
          </div>
          <div class="item-tag">
            <div class="label">Prompt</div>
            <div class="input-info">
              <l-input
                v-model="prompt.content"
                type="textarea"
                placeholder="请输入"
              />
            </div>
          </div>
          <div class="item-tag">
            <div class="label">Prompt Behavior</div>
            <div class="input-info">
              <Radio v-model="prompt.selected" :options="options" />
            </div>
          </div>
        </div>
        <div class="prompt-footer">
          <div class="right-box">
            <l-button>Cancel</l-button>
            <l-button
              style="margin-left: 0px"
              type="primary"
              @click="savePrompt"
              >Save</l-button
            >
          </div>
        </div>
      </popup>
      <message ref="message" />
      <!-- <div class="handle top" @mousedown="startResize('top', $event)" /> -->
      <div class="handle bottom" @mousedown="startResize('bottom', $event)" />
      <div class="handle left" @mousedown="startResize('left', $event)" />
      <div class="handle right" @mousedown="startResize('right', $event)" />
    </div>
    <login :is-login="isLogin" />
  </div>
</template>

<script>
import contentMixin from '../mixin/contentMixin'
import commonMixin from '../mixin/utilsMixin'
export default {
  mixins: [contentMixin, commonMixin],
}
</script>
<style scoped lang="less" src="./index.less"></style>
<!-- <style scoped lang="less" src="./floating.less"></style> -->
