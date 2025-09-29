import { defineStore } from 'pinia'
import { getQAList, getSessionList, getAnswerStream } from '../../api/index'
import { Typewriter } from '../../utils/typewriter.js'
import { isEmpty, remove } from 'lodash'
import { nanoid } from 'nanoid'
import JSONbig from 'json-bigint'
import { getAssetsFile } from '../../utils/index.js'
import { ElMessage } from 'element-plus';

// 将特定的内容替换 =>  ##1$$   中间的数字1就是对应chunks数组的下标
function replaceWithImgTags(regex, text, extraInfo) {
  const matches = text.match(regex) || []
  let resultText = text
  let delFileDoc_id = []
  matches.forEach(match => {
    const id = nanoid()
    const number = match.match(/\d+/)[0] // 提取数字
    let imgTag
    if (!isEmpty(extraInfo)) {
      const extraInfoChunks = extraInfo.chunks[number]
      if (!isEmpty(extraInfoChunks) && extraInfoChunks.parser_id == 'qa') {
        imgTag = ``
        delFileDoc_id.push(extraInfoChunks.doc_id)
      } else {
        imgTag = `<img src="${getAssetsFile(
          'img/lawInfo.png'
        )}" number="${number}" id="${id}" style="width:16px;height:16px; cursor: pointer;marginTop:0;" class="law-info-icon"/>`
      }
    } else {
      imgTag = ``
    }

    // 替换第一个出现的匹配项，确保按顺序逐个替换
    resultText = resultText.replace(match, imgTag)
  })

  return {
    resultText,
    delFileDoc_id
  }
}

const useSettingsStore = defineStore('settings', {
  state: () => ({
    sessionId: '', // 会话id
    showHome: true, //默认显示会话主页
    answerData: {
      answerList: [], //对话列表表格数据
      historyIdList: [] // 引用ID
    },
    sessionList: [], //会话列表 - 历史记录
    isSendBtnStatus: false, //是否发送按钮可用
    sessionBoxLoading: false, // 历史记录列表 - 加载状态
    answerBoxLoading: false // 会话列表 - 加载状态
  }),
  actions: {
    // 获取答案
    async getAnswerFn(originalQuestion, isRebuildDataItem = {}) {
      return new Promise((resolve, reject) => {
        this.showHome = false // 首页大提示窗体
        this.isSendBtnStatus = true // 发送按钮能否发送状态
        let nanoid_ = ''
        let flag = isEmpty(isRebuildDataItem) // 判断是否重新生成
        if (flag) {
          // 表格新数据的插入
          nanoid_ = nanoid()
          this.answerData.answerList.push({
            nanoid: nanoid_,
            originalQuestion, // 问题
            showContent: '', // 文本数据
            isShowAnswerQa: true, // 是否显示答案生成的提示
            isApiError: false, // 判断接口是否报错

            showHtml: false, // 是否显示html
            isShowChart: false, // 是否显示图表
            isShowPieChart: false, // 显示饼图
            isShowLineChart: false, // 显示条形图

            extraInfoSources: {}, // 法律法规的附加信息
            isFold: false
          })
        } else {
          // 重新生成对应ID的数据
          const { nanoid } = isRebuildDataItem
          nanoid_ = nanoid
        }
        const filterAnswerData = this.answerData.answerList.filter(v => v.nanoid === nanoid_)[0]

        setTimeout(() => {
          // 先将引用还原，为了在选择引用的时候点击发送消息时先在dom上消失，参数还是能保存下来
          if (this.answerData.historyIdList.length) {
            this.answerData.historyIdList = []
          }
        }, 200)

        //--------------------------------------------------------
        let nowData = [] // 所有返回的数据，但是取第一个数据
        // 打字机定义
        const typewriter = new Typewriter(streamingText => {
          if (streamingText) {
            filterAnswerData.showContent = streamingText

            // 判断是否显示html的死数据 - 后面待删除
            if (filterAnswerData.showContent.indexOf('北京张三有限公司周期') !== -1 && !filterAnswerData.showHtml) {
              filterAnswerData.showHtml = true
            }
          }

          // 将答案生成中... 页面先去除
          filterAnswerData.isShowAnswerQa = false
        })

        // 示例使用
        const streamGpt = new getAnswerStream('getAnswer', {
          onStart: prompt => {
            if (!flag) {
              // 替换原有的提示生成
              filterAnswerData.isShowAnswerQa = true
            }
          },
          onCreated: () => {
            // console.log('开始创建了')
            typewriter.start()
          },
          onPatch: data => {
            // console.log('有新的内容更新时执行--', data)
            try {
              let parsedData = JSONbig.parse(data) // 解决丢失精度问题
              nowData.push(parsedData) // 将解析后的数据添加到临时数组中

              if (!isEmpty(parsedData.showContent)) {
                const text = isEmpty(parsedData.showContent) ? '' : parsedData.showContent

                typewriter.add(text)
              }
            } catch (error) {
              filterAnswerData.isApiError = true
            }
          },
          onDone: () => {
            const { sessionId, techIntention, bizIntention, id, extraInfo } = nowData[nowData.length - 1]
            // 其他的操作
            this.sessionId = sessionId
            filterAnswerData.id = id?.toString()

            // 饼图
            if (techIntention == 0 && bizIntention == 2) {
              filterAnswerData.isShowChart = true
              filterAnswerData.isShowPieChart = true
            }

            // 柱状图
            if (techIntention == 0 && bizIntention == 3) {
              filterAnswerData.isShowChart = true
              filterAnswerData.isShowLineChart = true
            }
            // 获取历史记录
            if (this.answerData.answerList.length <= 1 && flag) {
              this.getAllHistoryList()
            }

            setTimeout(() => {
              typewriter.done()
              this.isSendBtnStatus = false // “发送”按钮的状态

              // biz_intention: 0是纯文本，1是表格 2是饼状图 3是柱状图
              // tech_intention: 0 - 数据查询，1 - 知识库查询，2 - 插件，3 - 其他
              // 等待接口完全返回后再显示对应的文件
              if (!isEmpty(extraInfo)) {
                let extraInfoParse = JSON.parse(extraInfo) || {}

                // 只有最后一条的消息才会插入对应的##1$$
                const regex = /##(\d+)[$]{2}/g
                if (regex.test(filterAnswerData.showContent)) {
                  // 正则表达式匹配 ##和$$ 之间的数字
                  const replaceTextObj = replaceWithImgTags(regex, filterAnswerData.showContent, extraInfoParse)

                  filterAnswerData.showContent = replaceTextObj.resultText

                  // 拿到parser_id == 'qa'的文件doc_id，从extraInfoParse.doc_aggs剔除对应doc_id的文件
                  if (!isEmpty(replaceTextObj.delFileDoc_id)) {
                    remove(extraInfoParse.doc_aggs, item => replaceTextObj.delFileDoc_id.includes(item.doc_id))
                  }
                }

                filterAnswerData.extraInfoSources = extraInfoParse
              }
            }, 3500)
            resolve(bizIntention)
          },
          errorCatch: error => {
            filterAnswerData.isShowAnswerQa = false
            filterAnswerData.isApiError = true // 显示接口报错
            this.isSendBtnStatus = false // “发送”按钮的状态

            reject(new Error('请求失败: ' + (error.message || error)))
          }
        })

        // 接口请求
        streamGpt.streamRequest({
          sessionId: this.sessionId,
          inputMessage: originalQuestion,
          historyIdList: this.answerData.historyIdList
        })
      })
    },
    // 获取所有 右侧 - 对话列表
    fetchData() {
      this.answerBoxLoading = true
      this.answerData.historyIdList = []
      getQAList({ sessionId: this.sessionId }).then(res => {
          // if (res.code == 0) {
            this.answerData.answerList = res.data.map(v => {
              if (!isEmpty(v.extraInfo)) {
                let extraInfoParse = JSON.parse(v.extraInfo) || {}

                const regex = /##(\d+)[$]{2}/g
                if (regex.test(v.showContent)) {
                  // 正则表达式匹配 ##和$$ 之间的数字
                  const replaceTextObj = replaceWithImgTags(regex, v.showContent, extraInfoParse)
                  v.showContent = replaceTextObj.resultText

                  if (!isEmpty(replaceTextObj.delFileDoc_id)) {
                    remove(extraInfoParse.doc_aggs, item => replaceTextObj.delFileDoc_id.includes(item.doc_id))
                  }
                }

                v.extraInfoSources = extraInfoParse
              }

              // // 饼图
              // if (v.techIntention == 0 && v.bizIntention == 2) {
              //   v.isShowChart = true
              //   v.isShowPieChart = true
              //   v.isShowLineChart = false
              // }

              // // 柱状图
              // if (v.techIntention == 0 && v.bizIntention == 3) {
              //   v.isShowChart = true
              //   v.isShowPieChart = false
              //   v.isShowLineChart = true
              // }

              // // 判断是否显示html的死数据带表格里面有进度条 - 后端固定HTML数据返回
              // if (v.showContent.indexOf('北京张三有限公司周期') !== -1) {
              //   v.showHtml = true
              // }

              v.originalQuestion = v.inputMsg
              v.showContent = v.outputMsg
              v.isFold = false
              return v
            })
          // } else if (res.code === 20001) {
          //   ElMessage({
          //     type: 'warning',
          //     message: res.message
          //   })
          // } else {
          //   this.showHome = true
          //   ElMessage({
          //     type: 'error',
          //     message: '历史会话接口报错！'
          //   })
          // }
          this.answerBoxLoading = false
        })

        // .catch(() => {
        //   this.showHome = true
        //   ElMessage({
        //     type: 'error',
        //     message: '历史会话接口报错！'
        //   })

        //   this.answerBoxLoading = false
        // })
    },
    // 获取会话列表
    getAllHistoryList() {
      this.sessionBoxLoading = true
      getSessionList()
        .then(res => {
          if (res.code === 0) {
            this.sessionList = res.data
          }
          this.sessionBoxLoading = false
        })
        .catch(() => {
          this.sessionBoxLoading = false
        })
    }
  }
})

export default useSettingsStore
