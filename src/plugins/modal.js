import { MessagePlugin, NotifyPlugin, LoadingPlugin } from 'tdesign-vue-next'

let loadingInstance

export default {
  // 消息提示
  msg(content) {
    MessagePlugin.info(content)
  },
  // 错误消息
  msgError(content) {
    MessagePlugin.error(content)
  },
  // 成功消息
  msgSuccess(content) {
    MessagePlugin.success(content)
  },
  // 警告消息
  msgWarning(content) {
    MessagePlugin.warning(content)
  },
  messageBox(content) {
    return ElMessageBox.confirm(`${content}`, '系统提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      draggable: false,
      overflow: true
    })
  },

  // 弹出提示
  alert(content) {
    MessagePlugin.alert(content, '系统提示')
  },
  // 错误提示
  alertError(content) {
    MessagePlugin.alert(content, '系统提示', { type: 'error' })
  },
  // 成功提示
  alertSuccess(content) {
    MessagePlugin.alert(content, '系统提示', { type: 'success' })
  },
  // 警告提示
  alertWarning(content) {
    MessagePlugin.alert(content, '系统提示', { type: 'warning' })
  },
  // 通知提示
  notify(title, content) {
    NotifyPlugin.info({ title, content })
  },
  // 错误通知
  notifyError(title, content) {
    NotifyPlugin.error({ title, content })
  },
  // 成功通知
  notifySuccess(title, content) {
    NotifyPlugin.success({ title, content })
  },
  // 警告通知
  notifyWarning(title, content) {
    NotifyPlugin.warning({ title, content })
  },
  // 打开遮罩层
  loadingOpen(content = '加载中') {
    loadingInstance = LoadingPlugin.service({
      fullscreen: true,
      attach: 'body',
      content,
      preventScrollThrough: false
    })
  },
  // 关闭遮罩层
  closeLoading() {
    loadingInstance.hide()
  }
}
