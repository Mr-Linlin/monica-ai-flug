// import { getToken } from './auth'
import env from '../env.js'
import { fetchEventSource } from '@microsoft/fetch-event-source'

export class EventController {
  constructor() {
    this.eventCtroller = null
  }

  async startFetchEvent(url, body, outputCallback, chatEnd) {
    const eventCtroller = new AbortController()
    const headers = {
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate, br',
      // Authorization: `Bearer ${getToken()}`,
    }

    this.eventCtroller = eventCtroller
    fetchEventSource(env.VUE_APP_AI + url, {
      method: 'POST',
      headers,
      body,
      signal: eventCtroller.signal,
      onopen(response) {
        console.log('onopen', response)
      },
      onclose() {
        console.log('onclose')
        chatEnd()
      },
      onerror(err) {
        console.log('err', err)
        chatEnd()
      },
      onmessage: (response) => {
        // console.log(response.data)
        outputCallback(response.data)
      },
    })
  }

  stopFetchEvent() {
    if (this.eventCtroller) {
      this.eventCtroller.abort()
      this.eventCtroller = null
    }
  }
}
