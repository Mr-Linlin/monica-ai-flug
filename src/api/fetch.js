import qs from 'qs'
class FetchRequest {
  constructor() {
    this.testUrl = 'https://ejcvirv.belikehub.com:30003'
    // this.baseUrl = 'https://ejcvirv.belikehub.com';
    this.baseUrl = 'https://chat.easyhelpai.com';
    this.headers = {
      token: 'b4d4bd9d-7aa2-4511-97ad-60d1e34de214',
      platform: 'H5',
      appid: 'y6570wjbxyzvvmgr98907741',
      lang: 'en'
    }
  }

  async get(url, params = {}) {
    url = new URL(`${this.baseUrl}${url}`);
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(`${url}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        ...this.headers
      },
      ...params
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`)
    }

    const data = await response.json()

    return data
  }

  async post(url, data = {}, params = {}) {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      credentials: 'include',
      body: qs.stringify(data),
      ...params,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`)
    }

    const responseData = await response.json()

    return responseData
  }
  async postJson(url, data = {}, params = {}) {
    const response = await fetch(`${this.testUrl}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip, deflate, br',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`)
    }

    try {
      const reader = response.body.getReader()
      const push = async (controller, reader) => {
        const { value, done } = await reader.read()
        if (done) {
          controller.close()
        } else {
          onmessage?.(Uint8ArrayToString(value))
          controller.enqueue(value)
          push(controller, reader)
        }
      }
      const stream = new ReadableStream({
        start(controller_2) {
          push(controller_2, reader)
        },
      })
      const stream_1 = stream
      return await new Response(stream_1, {
        headers: { 'Content-Type': 'text/html' },
      }).text()
    } catch (error) {
      throw new Error(`请求失败`)

    }
    // const responseData = await response.json();
    // return responseData;
  }
  async postFormData(url, data = {}) {
    const formData = new FormData()
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key])
    })

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`)
    }

    const responseData = await response.json()
    return responseData
  }
}
/**
 * 将Uint8Array转换为字符串
 * @param {Uint8Array} fileData
 * @returns
 */
const Uint8ArrayToString = (fileData) => {
  const utf8 = Array.from(fileData)
    .map((item) => String.fromCharCode(item))
    .join('')

  return decodeURIComponent(escape(utf8))
}

export default FetchRequest
