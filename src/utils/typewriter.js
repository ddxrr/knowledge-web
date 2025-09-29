// 打字机效果封装
export class Typewriter {
  constructor(onConsume) {
    this.queue = []
    this.consuming = false
    this.timer = null
    this.onConsume = onConsume
    this.currentText = '' // 当前已经消费的文本
    this.previousText = '' // 上一次消费的文本
  }

  // 输出速度动态控制
  dynamicSpeed() {
    const speed = 2000 / this.queue.length
    if (speed >= 40) {
      return 40
    } else {
      return speed
    }
  }

  // 添加字符串到队列
  add(str) {
    if (!str) return
    // this.queue.push(...str.split(''))
    this.queue.push(str)
  }

  // 消费
  consume() {
    if (this.queue.length > 0) {
      const str = this.queue.shift()
      str && this.onConsume(str)
    }
  }

  // 消费下一个
  next() {
    this.consume()

    // 根据队列中字符的数量来设置消耗每一帧的速度，用定时器消耗
    this.timer = setTimeout(() => {
      this.consume()
      if (this.consuming) {
        this.next()
      }
    }, this.dynamicSpeed())
  }

  // 开始消费队列
  start() {
    this.consuming = true
    this.next()
  }

  // 结束消费队列
  done() {
    this.consuming = false
    clearTimeout(this.timer)
    this.timer = null

    // 把queue中剩下的字符一次性消费
    // this.onConsume(this.queue.join(''))
    this.onConsume(this.queue[this.queue.length - 1])
    this.queue = []
  }
}

// 示例使用
// const typewriter = new Typewriter(str => console.log(str))
// typewriter.add('Hello,World')

// typewriter.start()
// setTimeout(() => {
//   typewriter.done()
// }, 8000)
