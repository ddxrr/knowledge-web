<template>
  <div class="talkInfoBoss">
    <div class="talkInfoBox" ref="talkInfoBoxRef">
      <div class="answerContentList" v-for="item in settingsStore_.answerData.answerList" :key="item.id">
        <!-- 用户 -->
        <div class="userBox">
          <div class="userQuestion" v-html="item.originalQuestion"></div>
          <div><img src="../../../assets/img/userLogo.png" /></div>
        </div>

        <!-- 机器人回答 -->
        <div class="answerBox">
          <!-- 机器人图标 -->
          <div class="robotImg"><img src="../../../assets/img/robotLogo.png" /></div>
          <!-- 答案生成中... -->
          <div class="wait01" v-if="item.isShowAnswerQa">
            答案生成中<span class="dot1">. </span><span class="dot2">. </span><span class="dot3">. </span>
          </div>

          <div class="dataContentBox" v-else>
            <div
              :id="item.id"
              class="textBox"
              v-menus:right="menus"
              @contextmenu="rightClick($event, item.id)"
              v-if="item.showContent && item.showContent !== ''"
            >
              <div>
                <!-- 显示markdown数据 -->
                <div
                  class="markdownBox"
                  ref="contentRef"
                  :class="{ isFold: item.isFold }"
                  @mouseover="handleMouseover($event, item)"
                  @mouseleave="handleMouseleave"
                  v-html="renderMarkdown(item.showContent)"
                />

                <!-- 显示表格死数据（待删除） -->
                <!-- <div ref="contentRef" v-else :class="{ isFold: item.isFold }" v-html="item.showContent" /> -->
              </div>

              <!-- 图标 -->
              <div class="iconBox">
                <!-- 是否折叠 -->
                <el-tooltip class="box-item" effect="dark" :content="item.isFold ? '展开' : '折叠'" placement="top">
                  <el-icon
                    class="foldIcon"
                    :size="18"
                    v-show="item.showContent.length > 400 && !item.isFold"
                    @click="isFold(item)"
                  >
                    <Fold />
                  </el-icon>
                </el-tooltip>
              </div>

              <div class="expend" v-if="item.isFold" @click="isFold(item)">
                点击展开
                <el-icon><ArrowDown /></el-icon>
              </div>
            </div>

            <div class="tableBox isEmpty" v-else>
              {{
                item.isApiError
                  ? '很抱歉，我们发现您在使用查询时遇到了问题。请尝试重新生成或使用其他关键词查询。谢谢！'
                  : '很抱歉，暂时没有找到相关信息。请尝试使用其他关键词搜索或提供更多信息。谢谢！'
              }}

              <div class="answerBut" v-show="item.isApiError" @click="changeAgain(item)">
                <el-icon> <RefreshRight /> </el-icon>重新生成
              </div>
            </div>

            <!-- 对应内容底部回答文件的出处 -->
            <!-- <div
              v-show="item.extraInfoSources && !isEmpty(item.extraInfoSources?.doc_aggs) && !item.isFold"
              class="fileBottomBox"
            >
              <t-list :split="true" size="small">
                <t-list-item
                  v-for="fileItem in item.extraInfoSources?.doc_aggs"
                  :key="fileItem.doc_id"
                  @click="openFileWindow(fileItem)"
                >
                  <img :src="fileType(fileItem)" v-show="fileType(fileItem)" alt="" style="width: 24px; height: 24px" />
                  {{ fileItem.doc_name }}
                </t-list-item>
              </t-list>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it' // markdown解析器
import { menusEvent } from 'vue3-menus'
import { useScroll } from '@vueuse/core'
import { includes, isEmpty, trim } from 'lodash'
import settingsStore from '../../../store/modules/settings.js'
import { getFileType, getAssetsFile } from '../../../utils/index.js'
// import { Plus } from '@element-plus/icons-vue'
import { md, renderChartPie, renderChartLine } from './talkInfoJs.js' //将md和图表方法渲染抽离
import { reactive,onMounted,ref,watch,getCurrentInstance,shallowRef,nextTick,defineExpose } from 'vue'

// const router = useRouter()
const { proxy } = getCurrentInstance()
const settingsStore_ = settingsStore()
const pieChartRef = ref(null) // 饼图图表
const lineChartRef = ref(null) // 条形图图表
const talkInfoBoxRef = ref(null)
const contentRef = ref(null)
const quoteID = ref('')

// 指令法律法规数据滑入浮窗
const popoverTargetRef = ref(null) // 动态绑定图片的ID
const popoverRef = ref(null)
const showData = ref({}) // 气泡里面显示的内容对象
const handleMouseover = (event, itemData) => {
  const target = event.target.closest('.law-info-icon')
  if (target) {
    const popover = popoverRef.value
    if (popover) {
      const indexNumber = target.getAttribute('number') // 数据下标
      popoverTargetRef.value = document.getElementById(target.id)
      showData.value = itemData.extraInfoSources?.chunks[indexNumber] || {}
    }
  }
}

const handleMouseleave = event => {
  const target = event.target.closest('.law-info-icon')
  if (target) {
    const popover = popoverRef.value
    if (popover) {
      unref(popoverRef).popperRef?.delayHide?.()
    }
  }
}

// 文件查看
const openFileWindow = fileItem => {
  const { doc_id, doc_name } = fileItem

  if (doc_name) {
    const type = getFileType(doc_name)
    if (doc_name.indexOf('.') == -1) return // 区分是否是文件还是文本

    if (doc_id) {
      switch (type) {
        case 'pdf':
          // window.open(`/pdf/${doc_id}`)
          window.open(`/api/v1/document/get/${doc_id}`)
          return
        case 'xlsx':
          window.open(`/excel/${doc_id}`)
        case 'docx':
          window.open(`/docx/${doc_id}`)
        default:
          return false
      }
    }
  }
}

// 根据文件的后缀显示对应文件的小图片
const fileType = ({ doc_name }) => {
  const type = getFileType(doc_name)

  switch (type) {
    case 'pdf':
      return getAssetsFile('img/file/PDF.png')
    case 'xlsx':
      return getAssetsFile('img/file/xlsx.png')
    default:
      return false
  }
}

// 右键菜单
const menus = shallowRef({
  menus: [
    {
      label: '引用',
      // tip: 'quote',
      // divided: true,
      disabled: false,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" t="1706845257014" class="icon" viewBox="0 0 1024 1024" version="1.1" p-id="2332" width="16" height="16"><path d="M512.146827 268.510985c-250.902034 0-454.505322 157.57406-454.505322 359.095851 0 77.452531 32.639121 168.259723 83.298552 213.54786C166.24668 863.780505 88.131465 990.268512 109.075322 1018.193654c23.957624 31.943141 164.908706-79.128039 205.700895-61.760749C355.568406 973.800196 441.499439 987.04638 512.146827 987.04638c250.902034 0 447.742067-158.01764 454.089667-359.439545C972.069626 442.506103 768.001278 268.510985 512.146827 268.510985zM511.997535 950.528886C447.362645 950.528886 362.014817 933.770578 323.347087 920.455656c-38.351961-13.206444-179.982913 66.085924-179.982913 66.085924s52.530415-136.615167 29.151701-161.97227c-42.140114-45.708088-76.209862-124.513914-76.209862-195.375037 0-184.372531 186.277885-324.240977 415.827925-324.240977s415.35105 154.807323 415.447714 324.240977C927.690131 821.643613 741.54865 950.528886 511.997535 950.528886zM311.488568 622.945485m-64.394304 0a59.955 59.955 0 1 0 128.788609 0 59.955 59.955 0 1 0-128.788609 0ZM504.000204 622.945485m-64.394304 0a59.955 59.955 0 1 0 128.788609 0 59.955 59.955 0 1 0-128.788609 0ZM696.511839 622.945485m-64.394304 0a59.955 59.955 0 1 0 128.788609 0 59.955 59.955 0 1 0-128.788609 0Z" fill="#ffffff" p-id="2333"/></svg>',
      click: (configuration, event) => {
        if (settingsStore_.answerData.historyIdList.length >= 3) {
          proxy.$modal.msgWarning('引用数量超过3条，无法再次添加！')
          return true
        }

        const isHistoryIdListIncludes = includes(settingsStore_.answerData.historyIdList, quoteID.value)

        if (isHistoryIdListIncludes) {
          proxy.$modal.msgWarning('该数据已被引用，请选择其他！')
        } else {
          historyIdListPush({ id: quoteID.value })
        }

        return true
      }
    }
  ],
  menusClass: 'menus-item-class'
})
// 引用点击事件
function rightClick(event, id) {
  // 将对应的ID赋值
  quoteID.value = id
  menusEvent(event, menus.value)
  event.preventDefault()
}

function historyIdListPush(item) {
  const { id } = item
  settingsStore_.answerData.historyIdList.push(id)
}

// 重新生成
const changeAgain = item => {
  if (item.isApiError) {
    settingsStore_.getAnswerFn(item.originalQuestion, item)
  }
}

// 是否折叠
const isFold = item => {
  item.isFold = !item.isFold
}

// markDown渲染方法
function renderMarkdown(str) {
  // str = `| 姓名 | 年龄 | 成绩 |\n|------|------|------|\n| 张三 | 25   | 90   |\n| 李四 | 22   | 85   |\n| 王五 | 28   | 88   |\n| 赵六 | 24   | 92   |`
  // const fixedMarkdown = str.replace(/\\n/g, '\n')
  return md.render(str)
}

// 当首页调整文本框的高度时进入时来调整文本框的高度
watch(
  () => [settingsStore_.showHome, settingsStore_.answerData.answerList],
  ([value1, value2]) => {

    const talkInfoBoss = document.querySelector('.talkInfoBoss')
    const sendingBox = document.getElementById('sendingBox')

    talkInfoBoss.style.height = `calc(100% - ${sendingBox.style.height} )`
  }
)

// 自动滚动
const { y } = useScroll(talkInfoBoxRef)
const scrollDown = () => {
  nextTick(() => {
    y.value = talkInfoBoxRef.value?.scrollHeight || 0
  })
}

// 监听内容的变化来改变视图高度
watch(
  () => [
    settingsStore_.answerData.answerList.length,
    settingsStore_.answerData?.answerList[settingsStore_.answerData.answerList.length - 1]?.showContent,
    settingsStore_.answerData?.answerList[settingsStore_.answerData.answerList.length - 1]?.extraInfoSources
  ],
  () => {
    scrollDown()
  },
  { deep: true }
)

onMounted(() => {
  scrollDown()
})

defineExpose({
})
</script>

<style lang="scss">
// @import '../../../styles/variables.module.scss';

.markdownBox table {
  border-collapse: collapse;
  width: 100%;
  font-size: 14px;
  border: 1px solid #ccc;
  margin: 1em 0;
}

.markdownBox th,
.markdownBox td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

.markdownBox th {
  background-color: #e9e9e9;
  font-weight: 600;
}

.markdownBox tr:nth-child(even) {
  background-color: #f9f9f9;
}
</style>
<style lang="scss" scoped>
.talkInfoBoss {
  width: 100%;
  overflow: hidden;
  height: calc(100% - 30px);

  .talkInfoBox {
    height: 100%;
    padding: 0 8px;
    box-sizing: border-box;
    overflow: auto;
    overflow-x: hidden;

    .answerContentList {
      .userBox {
        display: flex;
        justify-content: flex-end;
        // flex-wrap: wrap;
        margin-bottom: 20px;
        font-size: 14px;
        font-family: 'pf';
        font-weight: 600;
        color: #ffffff;

        .userQuestion {
          display: flex;
          align-items: center;
          // min-height: 56px;
          background-color: rgba(216, 216, 216, 0.1);
          padding: 16px;
          border-radius: 14px 0px 14px 14px;
          color: #000;
          max-width: 500px;
          flex-wrap: wrap;
          word-break: break-all;
        }

        img {
          width: 32px;
          height: 32px;
          margin-left: 12px;
        }
      }

      .answerBox {
        margin-bottom: 24px;
        display: flex;

        .dataContentBox {
          width: 100%;
          // box-shadow: 0 16px 20px 0 rgba(174, 167, 223, 0.06);
          --maxWidth: 88%;

          .tableBox {
            width: max-content;
            max-width: var(--maxWidth);
            overflow: hidden;
            background: rgb(216, 216, 216, 0.1);
            padding: 8px 16px 15px 16px;
            border-radius: 0px 14px 14px 14px;
            box-sizing: border-box;
            border: 1px solid rgb(216, 216, 216, 0.2);
            display: flex;

            .row_text {
              cursor: pointer;
              // width: 110px;
              word-break: break-all;
              display: -webkit-box;
              /**对象作为伸缩盒⼦模型展⽰**/
              -webkit-box-orient: vertical;
              /**设置或检索伸缩盒⼦对象的⼦元素的排列⽅式**/
              -webkit-line-clamp: 2;
              /**显⽰的⾏数**/
              overflow: hidden;
              /**隐藏超出的内容**/
            }
          }

          .textBox {
            display: flex;
            width: 90%;
            // width: max-content;
            // max-width: 800px;
            position: relative;

            background: rgb(216, 216, 216, 0.1);
            padding: 8px 16px 15px 16px;
            border-radius: 0px 14px 14px 14px;
            box-sizing: border-box;
            border: 1px solid rgb(216, 216, 216, 0.2);

            font-family: pf;
            color: #000;
            font-weight: 500;
            font-size: 14px;
            letter-spacing: 0.15em; /* 字符间距 */

            .markdownBox {
              width: 100%;
            }

            // 图标
            .iconBox {
              display: flex;
              align-items: center;
              flex-wrap: nowrap;
              position: absolute;
              top: 0;
              right: -55px;
              width: 55px;
              padding: 0 5px;
              .foldIcon {
                cursor: pointer;
                margin-right: 5px;
              }
            }

            .expend {
              width: 100%;
              position: absolute;
              bottom: 0;
              left: 0;
              height: 50px;
              background-color: rgba(216, 216, 216, 0.8);
              color: #595a52;
              text-align: center;
              font-size: 16px;
              line-height: 50px;
              border-radius: 0 0 8px 8px;
              cursor: pointer;
              .el-icon {
                margin-top: 5px;
              }

              &:hover {
                color: gray;
              }
            }

            // 折叠
            .isFold {
              height: 200px;
              // width: max-content;
              overflow: hidden;
            }

            img,
            ol,
            pre,
            table:not(.hljs),
            ul,
            p,
            p + p,
            pre + p,
            table + p,
            ul + p {
              margin-top: 8px;
            }

            ol,
            ul {
              padding-left: 20px;
            }

            table {
              border-collapse: collapse;
              width: 100%;
              background-color: #1f263d;

              border-radius: 8px; /* 设置圆角 */
              overflow: hidden; /* 隐藏溢出的内容 */
              th {
                color: #afafaf;
                text-align: center;
              }
              th,
              td {
                // border: 1px solid #ddd; /* 设置单元格边框 */
                padding: 8px;
                box-sizing: border-box;
                font-weight: 400;
                text-align: center;
                border-right: 1px solid #000;
                border-bottom: 1px solid #000;
                white-space: wrap;
                // word-wrap: break-word;
                word-break: break-all;
              }

              th:last-child,
              td:last-child {
                border-right: 0;
              }
              tr:last-child {
                td {
                  border-bottom: 0;
                }
              }
              tr:hover {
                background: #293250;
                // border: 1px solid #19ebff;
                // box-sizing: ;
                // td {
                //   border-top: #19ebff;
                // }
              }

              th {
                background: #19202e; /* 设置表头背景色 */
              }

              // 自定义单元格
              .custom-clickable-cell {
                cursor: pointer;

                color: #19ebff;

                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }

          .fileBottomBox {
            width: 100%;
            max-width: var(--maxWidth);
            overflow: hidden;
            margin-top: 8px;

            .t-list {
              background: transparent;
              .t-list__inner {
                width: 100%;
                border-radius: 8px;
                border: 1px solid rgba(157, 157, 157, 0.24);
                .t-list-item {
                  font-family: 'pf';
                  font-size: 14px;
                  color: #19ebff;
                  border-bottom: 1px solid rgba(157, 157, 157, 0.24);
                  cursor: pointer;
                  img {
                    margin-right: 5px;
                  }
                  .t-list-item-main {
                    justify-content: start !important;
                  }

                  &::after {
                    display: none;
                  }
                }

                .t-list-item:last-child {
                  border-bottom: 0;
                }
              }
            }
          }

          .isEmpty {
            color: #000;
          }
        }

        // 等待状态
        .wait01 {
          height: 32px;
          line-height: 32px;
          font-size: 14px;
          font-family: 'pf';
          font-weight: 600;
          color: #000;

          .dot1 {
            animation: blink1 1s infinite;
          }

          .dot2 {
            animation: blink2 1.2s infinite;
          }

          .dot3 {
            animation: blink3 1s infinite;
          }

          @keyframes blink1 {
            0% {
              opacity: 0.8;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.8;
            }
          }

          @keyframes blink2 {
            0% {
              opacity: 0.6;
            }

            50% {
              opacity: 1.2;
            }

            100% {
              opacity: 0.6;
            }
          }

          @keyframes blink3 {
            0% {
              opacity: 0.4;
            }

            50% {
              opacity: 1;
            }

            100% {
              opacity: 0.4;
            }
          }
        }

        .robotImg img {
          width: 32px;
          height: 32px;
          margin-right: 12px;
        }

        .answerBut {
          cursor: pointer;
          // height: 56px;
          display: flex;
          align-items: center;
          font-size: 14px;
          font-family: 'pf';
          font-weight: 400;
          color: #000;

          img {
            width: 16px;
            height: 16px;
            margin: 0 4px 0 16px;
          }

          .el-icon {
            width: 16px;
            height: 16px;
            margin: 0 4px 0 16px;
          }
        }
      }
    }
  }
}

.line {
  width: 100px;
  height: 10px;
  border: radius 5px;
}

.line.orange {
  background-color: orangered;
}

.line.red {
  background-color: rgb(151, 2, 2);
}

.el-popper.is-light.my_popover {
  // min-width: 796px !important;
  // height: 207px !important;
  max-width: 1100px;
  background: #07152be5;
  box-shadow: 0px 5px 10px 0px rgba(35, 35, 35, 0.58);
  border-radius: 8px;
  border: 1px solid #5b7fec;
  padding: 12px;

  font-family: 'pf';
  font-weight: 400;
  font-size: 14px;
  color: #ffffff;

  & > .el-popper__arrow::before {
    background: #07152be5 !important;
    border: 1px solid #5b7fec;
  }

  .popoverBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    // .leftImg {
    // }
    .rightContent {
      ol {
        padding-left: 23px;
      }
    }
  }

  .bottom {
    font-size: 14px;
    color: #19ebff;
    font-style: normal;
  }
}
</style>

