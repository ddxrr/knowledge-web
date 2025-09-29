import { defineStore } from 'pinia'

import { isEmpty } from 'lodash'
import { nanoid } from 'nanoid'

const usePlatformReportStore = defineStore('platformReport', {
  state: () => ({
    sessionId: '', // 会话id
    fixedAnswer: '123456', // 固定回复
    showFocusHome: true, //默认显示会话主页
    answerData: {
      answerList: [
        {
          nanoid: '1',
          userBoxShow: false, // 是否显示用户问题的Box
          originalQuestion: '', // 问题
          showContent:
            '您好，我是AI报告助手。我可以执行报告的编辑、续写、插入总结等指令。请选中报告中的文案，输入您想要执行的操作。', // 文本数据
          isShowAnswerQa: false, // 是否显示答案生成的提示
          isApiError: false, // 判断接口是否报错

          extraInfoSources: [], // 法律法规的附加信息
          isShowLawsIcon: false, // 是否为知识库的法律法规依据-眼睛
          isFold: false
        }
      ], //对话列表表格数据
      historyIdList: [] // 引用ID
    },
    sessionList: [], //会话列表 - 历史记录
    isSendBtnStatus: false, //是否发送按钮可用
    sessionBoxLoading: false, // 历史记录列表 - 加载状态
    answerBoxLoading: false // 会话列表 - 加载状态
  }),
  actions: {
    // 获取答案
    async getAnswerFn(originalQuestion, isRebuildDataItem = {}, addRobotFlag = false) {
      this.showFocusHome = false // 首页大提示窗体
      this.isSendBtnStatus = true // 发送按钮能否发送状态
      let nanoid_ = ''
      let flag = isEmpty(isRebuildDataItem) // 判断是否重新生成
      if (flag) {
        // 表格新数据的插入
        nanoid_ = nanoid()
        this.answerData.answerList.push({
          nanoid: nanoid_,
          userBoxShow: true, // 是否显示用户问题的Box
          originalQuestion, // 问题
          showContent: '', // 文本数据
          isShowAnswerQa: true, // 是否显示答案生成的提示
          isApiError: false, // 判断接口是否报错

          extraInfoSources: [], // 法律法规的附加信息
          isShowLawsIcon: false, // 是否为知识库的法律法规依据-眼睛
          isFold: false
        })
      } else {
        // 重新生成对应ID的数据
        const { nanoid } = isRebuildDataItem
        nanoid_ = nanoid
      }

      const filterAnswerData = this.answerData.answerList.filter(v => v.nanoid === nanoid_)[0]

      if (addRobotFlag) {
        filterAnswerData.originalQuestion = ''
        filterAnswerData.userBoxShow = false
        filterAnswerData.showContent = originalQuestion
      } else {
        filterAnswerData.showContent = this.fixedAnswer
      }
      filterAnswerData.isShowAnswerQa = false
      this.isSendBtnStatus = false
    }
  }
})

export default usePlatformReportStore
