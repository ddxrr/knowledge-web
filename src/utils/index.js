// 工具函数
import { dateInfo } from './time'
/**
 * @param {date} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 * @returns {String}
 */
export function formatTime(time, fmt) {
  if (!time) return ''
  const date = new Date(time * 1)
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        // @ts-ignore: Unreachable code error
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

// 获取当年开始结束时间
export function getTime() {
  let startTime = new Date(new Date().getFullYear(), 0, 1).getTime()
  let endTime = new Date(new Date(new Date().getFullYear() + 1, 0, 0).setHours(23, 59, 59, 59)).getTime()

  startTime = dateInfo(startTime)
  endTime = dateInfo(endTime)

  return { startTime, endTime }
}

// 数字转换为千位符
export function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 文件导出
export function fileExport(response) {
  return new Promise((resolve, reject) => {
    const contentDisposition = decodeURIComponent(response.headers['content-disposition'])

    // 文件名称
    let fileName = contentDisposition.split('attachment;filename=')[1]
    const downloadElement = document.createElement('a')
    // { type: response.data.type }
    const blob = new Blob([response.data]) // 创建一个类文件对象：Blob对象表示一个不可变的、原始数据的类文件对象
    const href = window.URL.createObjectURL(blob) // 创建下载链接
    downloadElement.href = href
    downloadElement.download = `${fileName}` // 下载后文件名
    document.body.appendChild(downloadElement)
    downloadElement.click() // 点击下载
    document.body.removeChild(downloadElement) // 下载完成移除元素
    window.URL.revokeObjectURL(href) // 下载完成进行释放
    resolve(true)
  })
}

/* 判断各个浏览器版本号 */
function matchVesion() {
  let userAgent = navigator.userAgent
  let rMsie = /(msie\s|trident.*rv:)([\w.]+)/
  let rEdge = /(edg)\/([\w.]+)/
  let rFirefox = /(firefox)\/([\w.]+)/
  let rOpera = /(opera).+version\/([\w.]+)/
  let rChrome = /(chrome)\/([\w.]+)/
  let rSafari = /version\/([\w.]+).*(safari)/
  let ua = userAgent.toLowerCase()
  var match = rMsie.exec(ua)
  if (match !== null) {
    return { browser: 'IE', version: match[2] || '0' }
  }
  var rEmatch = rEdge.exec(ua)
  if (rEmatch !== null) {
    return { browser: 'Edge', version: rEmatch[2] || '0' }
  }
  var rFmatch = rFirefox.exec(ua)
  if (rFmatch !== null) {
    return { browser: rFmatch[1] || '', version: rFmatch[2] || '0' }
  }
  var rOmatch = rOpera.exec(ua)
  if (rOmatch !== null) {
    return { browser: rOmatch[1] || '', version: rOmatch[2] || '0' }
  }
  var rCmatch = rChrome.exec(ua)
  if (rCmatch !== null) {
    return { browser: rCmatch[1] || '', version: rCmatch[2] || '0' }
  }
  var rSmatch = rSafari.exec(ua)
  if (rSmatch !== null) {
    return { browser: rSmatch[2] || '', version: rSmatch[1] || '0' }
  }
  if (match !== null) {
    return { browser: '', version: '0' }
  }
}

export function initBrowserVersion() {
  let browserMatch = matchVesion()
  return browserMatch
}

// 获取assets静态资源
export const getAssetsFile = url => {
  return new URL(`../assets/${url}`, import.meta.url).href
}

/**
 * 判断文件类型的通用方法
 * @param {string} fileName - 文件名称或文件路径
 * @returns {string} - 返回文件类型（如 'pdf', 'image', 'video', 'audio', 'document' 等）
 */
export function getFileType(fileName) {
  // 提取文件扩展名
  const extension = fileName.split('.').pop().toLowerCase()

  // 根据扩展名判断文件类型
  switch (extension) {
    case 'pdf':
      return 'pdf'
    case 'xlsx':
      return 'xlsx'
    // case 'jpg':
    // case 'jpeg':
    // case 'png':
    // case 'gif':
    // case 'bmp':
    // case 'svg':
    //   return 'image'
    // case 'mp4':
    // case 'avi':
    // case 'mov':
    // case 'wmv':
    // case 'flv':
    // case 'mkv':
    //   return 'video'
    // case 'mp3':
    // case 'wav':
    // case 'aac':
    // case 'flac':
    // case 'ogg':
    //   return 'audio'
    // case 'doc':
    // case 'docx':
    // case 'xls':
    // case 'xlsx':
    // case 'ppt':
    // case 'pptx':
    // case 'txt':
    // case 'rtf':
    // case 'odt':
    //   return 'document'
    // case 'zip':
    // case 'rar':
    // case '7z':
    // case 'tar':
    // case 'gz':
    //   return 'archive'
    // case 'html':
    // case 'htm':
    // case 'css':
    // case 'js':
    // case 'json':
    // case 'xml':
    // case 'yaml':
    // case 'yml':
    //   return 'code'
    default:
      return 'unknown'
  }
}

/**
 * 使用 formData 上传文件 - 支持多选。
 * @param {Object} config - 上传配置对象。
 * @param {string} [config.accept] - 默认打开的文件类型（可选）。
 * @param {boolean} [config.multiple=false] - 是否支持多选（可选，默认 false）。
 * @param {Function} callback - 回调函数
 * @returns {FormData} 包含文件的 FormData 对象。
 */
export function uploadFileFormData(config = {}, callback) {
  const { accept = '.pdf', multiple = false } = config
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  input.multiple = multiple
  const formData = new FormData()
  input.onchange = event => {
    const files = Array.from(event.target.files)
    if (files.length > 1) {
      for (let file of files) {
        formData.append('files', file)
      }
    } else {
      formData.append('file', files[0])
    }
    console.log('formData--', formData.values().next())

    // 返回formData数据
    if (callback) callback(formData)
  }
  input.click()
}


// 获取文件大小
export function getFileSize(size) {
  if (!size) return null
  if (size / 1024 < 1) return size + 'B'
  if (size / 1024 / 1024 < 1) return (size / 1024).toFixed(1) + 'KB'
  return (size / 1024 / 1024).toFixed(1) + 'MB'
}