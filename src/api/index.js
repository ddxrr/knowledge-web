import request from './request'
//⽤户登陆
export function userLogin(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
//首页推荐
export function homeRecommend(data) {
  return request({
    url: '/homepage/recommend',
    method: 'get',
    data
  })
}
//检索数据
export function getSearchAnswer(data) {
  return request({
    url: '/retrieve/data',
    method: 'post',
    data
  })
}
//文献详情
export function docDetail(params) {
  return request({
    url: '/retrieve/doc',
    method: 'get',
    params
  })
}
//获取对话列表
export function getSessionList(params) {
  return request({
    url: '/chat/getSessionList',
    method: 'get',
    params
  })
}
// 对话⻚-会话下的问答记录
export function getQAList(params) {
  return request({
    url: '/chat/getQAList',
    method: 'get',
    params
  })
}
//对话⻚-获取答案
export function getAnswer(data) {
  return request({
    url: '/chat/getAnswer',
    method: 'post',
    data
  })
}
//对话⻚-删除会话
export function deleteSession(params) {
  return request({
    url: '/chat/delSession',
    method: 'get',
    params
  })
}
// 获取回答接口封装
export class getAnswerStream {
  constructor(key, options) {
    const { onStart, onCreated, onDone, onPatch, errorCatch } = options
    this.onStart = onStart // 调用函数后  请求发出前
    this.onCreated = onCreated // 发出请求收到第一个回复后执行
    this.onPatch = onPatch // 有新的内容更新时执行
    this.onDone = onDone // 传输结束时执行
    this.errorCatch = errorCatch
  }

  async streamRequest(data = {}) {
    let finish = false
    let count = 0

    this.onStart()

    try {
      const res = await this.fetch(data)
      // 如果接口报错直接返回错误
      if (res.status !== 200) {
        this.errorCatch(e)
        return
      }

      if (!res.body) return

      // 获取响应流
      const stream = res.body
      // 使用 TextDecoderStream 转换为文本流
      const textStream = stream.pipeThrough(new TextDecoderStream())
      // 获取文本流的 Reader
      const reader = textStream.getReader()

      let rawData = ''
      while (!finish) {
        const { done, value } = await reader.read()
        // console.log('🚀 ~ getAnswerStream ~ streamRequest ~ done:', value)

        if (done) {
          finish = true
          this.onDone()
          break
        }

        rawData += value // 累积数据
        // console.log('🚀 ~ getAnswerStream ~ streamRequest ~ rawData:', rawData)
        count++

        if (count === 1) {
          this.onCreated()
        }

        // if (rawData.startsWith('data:')) {
        //   const data = rawData.substring(5) // 去掉"data:"前缀
        //   this.onPatch(data)
        // }

        while (rawData.includes('\n\n')) {
          const endIndex = rawData.indexOf('\n\n') // 找到第一个完整数据段的结束位置
          const completeData = rawData.slice(0, endIndex) // 获取完整的数据段
          rawData = rawData.slice(endIndex + 2) // 移除已处理的数据段
          const lines = completeData.split('\n')

          for (let line of lines) {
            if (line.startsWith('data:')) {
              const data = line.substring(5) // 去掉"data:"前缀
              this.onPatch(data)
            }
          }
        }
      }
    } catch (e) {
      this.errorCatch(e)
      return
    }
  }

  async fetch(data) {
    return fetch('/api/chat/getAnswer', {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify(data)
    })
  }
}

