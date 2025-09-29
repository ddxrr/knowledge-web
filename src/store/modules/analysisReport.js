import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import useTemplateStore from './templateBase.js'

const templateStore = useTemplateStore()
export const useStore = defineStore('analysisReport', {
  state: () => ({
    selectHtmlText: '',
    selectTitle: '',
    dataList: [
      {
        id: nanoid(),
        reportName: '监督平台预警情况汇报', // 报告名称
        briefIntroduction: '监督平台预警情况汇报简介', // 简介
        timeHorizonStart: '2024-2-21', // 时间范围
        timeHorizonEnd: '2024-3-21', // 时间范围
        LatestUpdate: '张三', // 最近更新人
        updataTime: 'Wed Mar 27 2024', // 最近更新时间
        template: '监督平台预警情况汇报',
        collect: false, // 收藏
        delete: false, // 逻辑删除 true就是回收站
        fixedAnswer: '监督平台预警情况汇报',
        treeData: [
          {
            id: nanoid(),
            treeCustomClass: false,
            label: '采购合规监督场景',
            children: [
              {
                id: nanoid(),
                treeCustomClass: true,
                label: '招标公告发布时间未达到法定要求',
                htmlText:
                  '1.1.1预警项目数量 <span style="color:red;cursor:pointer;"><u>4</u></span>个标段（包）<br/>1.1.2预警级别：<span style="color:red;cursor:pointer;"><u>2级（红灯）</u></span><br/>1.1.3预警原因：<br/>（1）项目为线下/线上相结合项目的入场项目，时间存在选择不足20天的情况。<br/>（2）在平台交易的全流程采购项目，采购方式为公开招标，从公开发布开始时间到截标时间，时间小于20天。<br/>1.1.4采购管理建议:<br/>规范公开招标公告发布时间，针对在平台上全流程交易项目和进场（政府交易中心）交易项目，均应严格按照公开招标标准时间发布。进场（政府交易中心）交易项目，虽只在平台上发布公告，但也需要严格按制度设置时间标准。<br/>1.1.5<span style="color:red;cursor:pointer;"><u>具体项目：</u></span><br/>  <table style="border-collapse: collapse; width: 100%;" border="1"><colgroup><col style="width: 33.3067%;"><col style="width: 33.3067%;"><col style="width: 33.3067%;"></colgroup><tbody><tr><td style="text-align: center;"><strong>标段（包）</strong></td><td style="text-align: center;"><strong>管理要素</strong></td><td style="text-align: center;"><strong>预警级别</strong></td></tr><tr><td style="text-align: center;">电子疲劳试验设备采购项目</td><td style="text-align: center;">招标公告发布时间未达到法定要求</td><td style="text-align: center;">红灯</td></tr><tr><td style=" text-align: center;">2023年度进口物资清关服务</td><td style="text-align: center;">招标公告发布时间未达到法定要求</td><td style="text-align: center;">红灯</td></tr><tr><td style=" text-align: center;">中纺绿纤公司厂区地面硬化项目</td><td style="text-align: center;">招标公告发布时间未达到法定要求</td><td style="text-align: center;">红灯</td></tr><tr><td style=" text-align: center;">成品、原料搬运装卸外包服务</td><td style="text-align: center;">招标公告发布时间未达到法定要求</td><td style="text-align: center;">红灯</td></tr> </tbody></table>'
              },
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '补遗文件发布时间未达到法定要求',
                htmlText:
                  '1.2.1预警项目数量：25个标段（包）<br/>1.2.2预警级别：1级（黄灯）<br/>1.2.3预警原因：采购方式为公开招标，在距离发布了补遗文件，且重新上传了采购文件（格式：ZBJ），截标/开标时间并未延长。<br/>1.2.4采购管理建议:<br/>严格规范交易系统变更补遗类型选择，如果是采购文件实质性变更，选择【变更】后发布文件变更。不属于采购文件实质性变更的，选择【补遗澄清】后发布补遗澄清文件。'
              }
            ]
          },
          {
            id: nanoid(),
            treeCustomClass: false,
            label: '围标串标监督场景',
            children: [
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '同标段（包）股权存在参股关系',
                htmlText:
                  '2.1.1预警项目数量：8个标段（包）<br/>2.1.2预警级别：1级（黄灯）<br/>2.1.3预警原因：同一标段(包)的投标供应商股权存在参股关系<br/>2.1.4采购管理建议:<br/>（1）同一标段(包)的投标供应商股权存在参股关系时，黄灯提示，要求采购人确认是否有风险，说明理由并关闭提示。'
              },
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '同标段（包）股权存在控股关系',
                htmlText:
                  '2.2.1预警项目数量：3个标段（包）<br/>2.2.2预警级别：2级（红灯）<br/>2.2.3预警原因：同一标段(包)的投标供应商股权存在控股关系<br/>2.2.4采购管理建议:<br/>（1）同一标段(包)的投标供应商股权存在控股关系时，违反相关法律法规规定，建议做“否决投标”处理。'
              }
            ]
          },
          {
            id: nanoid(),
            treeCustomClass: false,
            label: '专家监督场景',
            children: [
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '存在专家超龄',
                htmlText:
                  '3.1.1预警项目数量：41个标段（包）<br/>3.1.2预警级别：1级（黄灯）<br/>3.1.3预警原因：专家评标时年超65周岁（包含65周岁）<br/>3.1.4采购管理建议:<br/>实时监控专家年龄，超过法定规定年龄，禁止其参加评标评审工作。'
              },
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '专家比例异常',
                htmlText:
                  '3.2.1预警项目数量：1个标段（包）<br/>3.2.2预警级别：1级（黄灯）<br/>3.2.3预警原因：高级职称专家不足20%，或者专家库中未找到职称。<br/>3.2.4采购管理建议:<br/>针对高级职称专家不足20%，或者专家库中未找到职称的项目进行核查原因，如无问题，进行关闭预警。如存在问题，进行红灯预警处理。'
              },
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '黑名单专家参与评标',
                htmlText:
                  '3.3.1预警项目数量：84个标段（包）<br/>3.3.2预警级别：1级（黄灯）<br/>3.3.3预警原因：被列入黑名单或专家预设黑名单（已在建委库中被拉黑）的专家参与评标<br/>3.3.4采购管理建议:<br/>针对被列入黑名单或专家预设黑名单（已在建委库中被拉黑）的专家参与评标，建议修正集团采购管理制度，明确被列入黑名单或专家预设黑名单（已在建委库中被拉黑）的专家禁止参与评标。'
              }
            ]
          }
        ]
      },
      {
        id: nanoid(),
        reportName: '平台运营分析及交易报告',
        briefIntroduction: '平台运营分析及交易报告简介',
        timeHorizonStart: '2023-1-21',
        timeHorizonEnd: '2023-12-27',
        LatestUpdate: '李四',
        updataTime: 'Wed Mar 27 2024', // 最近更新时间
        template: '平台运营分析及交易报告',
        collect: false,
        delete: false,
        treeData: [
          {
            id: nanoid(),
            treeCustomClass: false,
            label: '交易数据总体分析',
            children: [
              {
                id: nanoid(),
                treeCustomClass: false,
                label: '交易总体数据',
                htmlText:
                  '在统计周期2023年1月至2023年12月之间，深圳市建设工程交易个数5211个，交易额2119.69亿元，节约资金1852438.99万元。<br/>2023年交易量同比分析结果显示:2月、3月、4月、5月、6月、7月、8月、9月、10月、11月、12月、同比均比上年有所增长。2017年交易额同比分析结果显示:3月、4月、5月、6月、8月、10月、11月、12月、同比均比上年有所增长。'
              },
              {
                id: '1-2',
                treeCustomClass: false,
                label: '各采购交易占比',
                htmlText:
                  '根据交易量进行分析，使用不同招标方式的项目占比分别为：公开招标占85.64%,邀请招标占3.28%,预选招标子工程占11.07%。<br/>根据交易额进行分析，使用不同招标方式的项目占比分别为:公开招标占98.07%,邀请招标占0.76%,预选招标子工程占1.17%。'
              }
            ]
          },
          {
            id: 2,
            treeCustomClass: false,
            label: '主体分析',
            children: [
              {
                id: '2-1',
                treeCustomClass: false,
                label: '主体注册增长情况',
                htmlText: '统计数据显示，累计注册企业22959家。'
              },
              {
                id: '2-2',
                treeCustomClass: false,
                label: '主体结构分布',
                htmlText:
                  '招投标项目参与主体主要为投标人、招标人、招标代理,其中，投标人的数量排在首位，占比82.73%，其余依次是招标人占比16.55%、招标代理占比0.72%。<br/>省内的参与主体数量排名依次为投标人、招标人、招标代理、投标人占比77.75%、招标人占比21.61%、招标代理占比0.64%。省外的参与主体数量排名依次为投标人、招标人、招标代理、投标人占比98.06%、招标人占比0.98%、招标代理占比0.96%。'
              },
              {
                id: '2-3',
                treeCustomClass: false,
                label: '主体行为分析',
                htmlText:
                  '通过对招标人、投标人、招标代理在交易过程中的行为方式进行分析，主要分析的方向包括：招标方式、资格审查方式、评分方法、中标金额区间分布；<br/>统计数据显示，项目中采用公开招标方式最多，占比88.74%,其中审查方式93.49%采用投标报名的方式。中标项目金额区间集中在0-100万,共计项目数量1560个，占比29.94%。'
              }
            ]
          }
        ]
      }
    ],
    leftBox: {
      my: true, // 我的
      attention: false, // 已关注
      recycleBin: false // 回收站
    },
    // 搜索关键字
    searchText: ''
  }),
  getters: {
    // 获取所有数据
    getAllNumList: state => state.dataList.filter(item => !item.delete),
    // 获取收藏数
    getCollectNumList: state => state.dataList.filter(item => item.collect),
    // 获取删除数量
    getDeleteNumList: state => state.dataList.filter(item => item.delete),
    // 获取模板
    getTemplateNumList: () => {
      let arr = []
      templateStore.dataList.forEach(item => {
        if (!item.delete) {
          arr.push(item.reportName)
        }
      })
      return arr
    },
    filterDataList: state => {}
  },
  persist: {
    enabled: true
  }
})
