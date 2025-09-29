/**
 * @param {date} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 * @returns {String}
 */

export function dateInfo(time) {
  const timestamp = time // 待转换的时间戳
  const date = new Date(timestamp) // 根据时间戳创建Date对象
  const year = date.getFullYear() // 获取年份
  // const month = date.getMonth() + 1 // 获取月份，需要加1
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0') // 获取日期
  const hour = date.getHours() // 获取小时
  const minute = date.getMinutes() // 获取分钟
  const second = date.getSeconds() // 获取秒数

  // const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}` // 拼接成格式化后的日期字符串
  const formattedDate = `${year}-${month}-${day}` // 拼接成格式化后的日期字符串

  return formattedDate
}
