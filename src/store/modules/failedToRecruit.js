// 应招未招智能体
import { defineStore } from 'pinia'

export default defineStore('failedToRecruitStore', {
  state: () => ({
    type: 'fileSelect', // 文件选择 - fileSelect 文件查看 - fileLook 文件分析 - fileAnalysis
    info: {},
    pdfUrl: '',
    tableInfoType: '2', //默认信息一致性
    lookFileType: false, //默认查看执行不显示
    agentFileInfoData: {} //查看执行结果
  }),
  getters: {
    // pdfUrl: state => `/api/sysFile/preview?sysFileId=${state.info?.sysFileId || ''}`
  },
  persist: {
    enabled: true
  },
  actions: {
    // 获取解析结果
    // getAgentFileInfoData(agentFileId) {
    //   this.agentFileInfoData = {}
    //   getAgentFileInfo({ agentFileId: agentFileId }).then(res => {
    //     if (res.code == 0) {
    //       this.agentFileInfoData = res.data
    //     }
    //   })
    // }
  }
})
