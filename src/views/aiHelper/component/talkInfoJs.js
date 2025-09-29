import MarkdownIt from 'markdown-it' // markdown解析器
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark-reasonable.css'
import { nextTick } from 'vue'

// markDown生成逻辑
// 测试数据
// '| 姓名 | 年龄 | 成绩 |\n|------|------|------|\n| 张三 | 25   | 90   |\n| 李四 | 22   | 85   |\n| 王五 | 28   | 88   |\n| 赵六 | 24   | 92   |'
export const md = MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></div></div>`
      } catch (e) {
        console.log('markDown渲染出错')
      }
    }
    return `<div class="hl-code"><div class="hl-code-header"><span>${lang}</span></div><div class="hljs"><code>${md.utils.escapeHtml(
      str
    )}</code></div></div>`
  },
  html: true
})

// 定义一个变量来存储目标列的索引
const targetColumnName = ['bid_section_code', '标段编号']
let targetRank = -1 // 存储目标列的索引

md.renderer.rules.thead_open = function (tokens, idx, options, env, self) {
  const nextToken = tokens[idx + 1]
  if (nextToken.type === 'tr_open') {
    const trIndex = idx + 2 // 跳过tr_open
    for (let i = trIndex; i < tokens.length; i++) {
      const token = tokens[i]

      if (token.type === 'th_open') {
        const inlineToken = tokens[i + 1]

        if (inlineToken.type === 'inline') {
          const content = inlineToken.content

          if (targetColumnName.includes(content)) {
            targetRank = (i - trIndex) / 3
            break
          } else {
            targetRank = -1
          }
        }
      } else if (token.type === 'tr_close') {
        break // 已经处理完表格头
      }
    }
  }
  return self.renderToken(tokens, idx, options)
}

let currentTdIndex = 0
md.renderer.rules.tr_open = function (tokens, idx, options, env, self) {
  currentTdIndex = 0
  return self.renderToken(tokens, idx, options)
}

// 修改td_open渲染规则，在目标列的单元格上添加类名
md.renderer.rules.td_open = function (tokens, idx, options, env, self) {
  currentTdIndex++
  if (currentTdIndex == targetRank + 1) {
    tokens[idx].attrJoin('class', 'custom-clickable-cell')
  }
  return self.renderToken(tokens, idx, options)
}

// 渲染饼图
export const renderChartPie = (pieChartRef, proxy) => {
  nextTick(() => {
    if (!pieChartRef.value) return

    pieChartRef.value.forEach(item => {
      let myChart = proxy.$echarts.init(item)
      let option

      // const backgroundColor = '#101736'
      // const title = {
      //   text: '网络/安全设备',
      //   textStyle: {
      //     color: '#fff',
      //     fontSize: 16
      //   },
      //   padding: 0,
      //   top: 35,
      //   left: 'center'
      // }
      const legend = {
        //data，就是取得每个series里面的name属性。2324
        orient: 'vertical',
        icon: 'circle', //图例形状
        padding: 0,
        bottom: 'center',
        right: 18,
        bottom: 0,
        itemWidth: 14, //小圆点宽度
        itemHeight: 14, // 小圆点高度
        itemGap: 21, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
        textStyle: {
          fontSize: 14,
          color: '#ffffff'
        }
      }
      const tooltip = {
        show: true,
        formatter: '{b}:{d}%'
      }
      const color = ['#03acd1', '#04cab7', '#03c781', '#fce348', '#fc2d8a', '#0292fe']
      option = {
        // backgroundColor,
        color,
        // title,
        tooltip,
        legend,
        series: [
          {
            name: '采购招标',
            type: 'pie',
            center: ['50%', '50%'], //圆心的位置
            top: '0', //单单指的饼图距离上面的距离，top越大饼图越小
            left: '0', //单单指的饼图距离左面的距离，会改变饼图的大小
            right: '12%',
            bottom: '10%',
            radius: ['0%', '60%'], //实心圆[内半径=0，外半径] 外半径越大，圆越大
            clockwise: true, //顺时针排列
            startAngle: 90, //起始角度 影响不大
            //roseType:"", // 实心圆 不能出现roseType这个属性
            label: {
              show: true, //false不显示饼图上的标签
              position: 'outside', //inside（在饼图上显示）,outside(默认就会出现引导线) center
              formatter: '{b}:{c}'
              // formatter: function (params) {
              //   console.log('🚀 ~ nextTick ~ params:', params)
              //   // 根据需要截取显示的文字长度
              //   const maxLength = 10
              //   let label = params.name.length > maxLength ? params.name.substring(0, maxLength) + '...' : params.name
              //   // 返回格式化后的标签内容
              //   return label + ':' + params.value
              // }
            },

            //只有设置了label:show=ture;position=outside 设置labelLine才会有效
            labelLine: {
              show: true, //显示引导线
              length: 15, //连接饼图第1段线条的长度 length length2 不写自适应
              length2: 5, //链接饼图第2段线条长度
              smooth: false //是否光滑连接线
            },
            itemStyle: {
              //每个扇形的设置
              borderColor: 'rgba(0,0,0,.1)', //扇形边框颜色
              borderWidth: 1 //扇形边框大小 要先给borderColor颜色 设置borderWidth才会有效果
            },
            data: [
              { value: 2520, name: '公开招标' },
              { value: 63, name: '邀请招标' },
              { value: 453, name: '询比采购' },
              { value: 1662, name: '谈判采购' },
              { value: 1043, name: '磋商采购' },
              { value: 53, name: '单一来源' }
            ].sort((a, b) => b.value - a.value), //数组从大到小排序

            emphasis: {
              //启用鼠标放上去放大效果，这个挺好的
              scale: true,
              scaleSize: 10,
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    })
  })
}

// 渲染柱状图
export const renderChartLine = (lineChartRef, proxy) => {
  nextTick(() => {
    if (!lineChartRef.value) return
    lineChartRef.value.forEach(item => {
      let myChart = proxy.$echarts.init(item)
      let option
      option = {
        // backgroundColor: '#000a3f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(9, 24, 48, 0.5)',
          borderColor: 'rgba(75, 253, 238, 0.4)',
          textStyle: {
            color: '#CFE3FC'
          },
          borderWidth: 1
        },
        grid: {
          top: '12%', // 减小 top 值使 Y 轴向内移动
          right: '0%', // 可以适当调整 right 和 left 来保持 X 轴和 Y 轴的平衡
          left: '10%', // 减小 left 值使 X 轴向内移动
          bottom: '10%' // 可以适当调整 bottom 来使 X 轴和 Y 轴相对于底部的距离
        },
        xAxis: [
          {
            // name: '采购方式',
            type: 'category',
            data: ['公开招标', '邀请招标', '询比采购', '谈判采购', '竞价采购', '磋商采购', '单一来源'],
            axisLine: {
              lineStyle: {
                color: '#FFFFFF'
              }
            },
            axisLabel: {
              interval: 0,
              margin: 10,
              color: '#e2e9ff',
              textStyle: {
                fontSize: 12
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            name: '个',
            axisLabel: {
              formatter: '{value}',
              color: '#e2e9ff'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#FFFFFF'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.12)'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            data: [2520, 63, 453, 1662, 523, 1043, 53],
            barWidth: '30%',
            itemStyle: {
              normal: {
                color: new proxy.$echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0,244,255,1)' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(0,77,167,1)' // 100% 处的颜色
                    }
                  ],
                  false
                ),
                shadowColor: 'rgba(0,160,221,1)',
                shadowBlur: 4
              }
            },
            label: {
              normal: {
                show: true,
                lineHeight: 10,
                formatter: '{c}',
                position: 'top',
                textStyle: {
                  color: '#00D6F9',
                  fontSize: 12
                }
              }
            }
          }
        ]
      }
      myChart.setOption(option)
    })
  })
}
