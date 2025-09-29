<template>
    <div class="rightAll">
        <div class="right-header">
            <div class="header-title"></div>
            <div class="header-user">
                <img src="../../assets/img/userImg.png" class="user-img">
                <div class="user-name">{{userInfo}}</div>
                <!-- <div class="home-btn" @click="returnHome">返回首页</div> -->
                <div class="quit-btn" @click="quitLogin">退出</div>
            </div>
        </div>
        <div class="right-talk" v-loading="settingsStore_.answerBoxLoading">
            <talk-info ref="talkInfoRef" />
        </div>
        <div class="right-question">
            <div class="sendingBox" id="sendingBox">
                <!-- 拖拽线 -->
                <div class="draggableMove"></div>
                <div class="sendContent">
                  <el-input
                      ref="textareaRef"
                      autosize
                      v-model.trim="sendInfo"
                      show-word-limit
                      :maxlength="inputParams.wordLimit"
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 5 }" 
                      :placeholder="inputParams.placeholder"
                      @keyup.enter.exact="textareaOrCtrlEnter($event, 'enter')"
                      @keyup.ctrl.enter="textareaOrCtrlEnter($event, 'ctrlEnter')"
                  />
                </div>
            </div>
            <div class="sendButBox">
                <p class="sendButTip">Enter发送，Ctrl+Enter换行</p>

                <!-- 发送按钮 -->
                <el-button
                  style="width: 79px; height: 36px; border-radius: 6px"
                  :disabled="settingsStore_.isSendBtnStatus"
                  @click="changeSend()"
                >
                    <template #default>
                        <div class="btn">发送</div>
                    </template>
                </el-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { reactive,onMounted,ref,watch,getCurrentInstance } from 'vue'
import settingsStore from '../../store/modules/settings.js'
import talkInfo from './component/talkInfo.vue'
import { useRouter } from 'vue-router'
import { isEmpty } from 'lodash'
const router = useRouter()
const settingsStore_ = settingsStore()
const talkInfoRef = ref(null)
const sendInfo = ref('') // 输入的文本
const userInfo = ref({})//用户信息
const { proxy } = getCurrentInstance()
const inputParams = reactive({
  placeholder: '请输入您需咨询的问题',
  wordLimit: 1000
})
// 发送消息
const changeSend = () => {
  if (sendInfo.value) {
    settingsStore_.getAnswerFn(sendInfo.value).then(bizIntention => {
      if (bizIntention == 2) {
        setTimeout(() => {
          talkInfoRef.value.renderChartPieFn()
        }, 500)
      } else if (bizIntention == 3) {
        setTimeout(() => {
          talkInfoRef.value.renderChartLineFn()
        }, 500)
      }
    })

    sendInfo.value = '' // 清空文本框
  } else {
    proxy.$modal.msgWarning(`请输入您需咨询的问题`)
    return
  }
}

// 文本框键盘事件
const textareaOrCtrlEnter = event => {
  if (event.keyCode === 13 && !settingsStore_.isSendBtnStatus) {
    if (event.ctrlKey) {
      // 判断字符串中的数量不得超过文本框输入的数量
      if (sendInfo.value.length === inputParams.wordLimit) return

      // 解决输入内容中间光标时的换行问题
      const inputElement = textareaRef.value.textarea
      const start = inputElement.selectionStart
      const end = inputElement.selectionEnd

      const before = sendInfo.value.substring(0, start)
      const after = sendInfo.value.substring(end)

      sendInfo.value = before + '\n' + after
    } else {
      // 判断字符串末尾是否是换行符,如果是换行符，删除末尾的换行符
      if (sendInfo.value.endsWith('\n')) {
        sendInfo.value = sendInfo.value.slice(0, -1)
      }
      changeSend()
    }

    event.preventDefault()
    return false
  }
}

watch(
  () => settingsStore_.answerData.historyIdList,
  value => {
    if (!isEmpty(value)) {
      inputParams.placeholder = '基于以上引用内容进行提问'
    } else {
      inputParams.placeholder = '请输入您需咨询的问题'
    }
  },
  { deep: true }
)
//退出
const quitLogin = () => {
    localStorage.removeItem('pro_userInfo')
    router.push({
        path:'/login',
        query:{}
    })
}
onMounted(() => {
  //登录人
  userInfo.value = localStorage.getItem('pro_userInfo')
  // 获取需要拖拽的元素和其父容器
  const draggableMove = document.querySelector('.draggableMove')
  const sendingBox = document.getElementById('sendingBox')

  // 鼠标按下事件
  draggableMove.addEventListener('mousedown', function (e) {
    e.preventDefault() // 防止默认行为
    const talkInfoBoss = document.querySelector('.talkInfoBoss')

    const startY = e.clientY
    const startHeight = sendingBox.clientHeight
    const startTalkInfoHeight = talkInfoBoss?.clientHeight

    // 鼠标移动事件
    document.addEventListener('mousemove', mouseMoveHandler)

    // 鼠标松开事件
    document.addEventListener('mouseup', function () {
      document.removeEventListener('mousemove', mouseMoveHandler)
    })

    // 鼠标移动处理函数
    function mouseMoveHandler(e) {
      const deltaY = e.clientY - startY

      let hight = startHeight - deltaY
      let hight2 = startTalkInfoHeight + deltaY

      if (hight >= 100 && hight <= 220) {
        sendingBox.style.height = hight + 'px'

        if (talkInfoBoss) {
          talkInfoBoss.style.height = hight2 + 'px'
        }
      }
    }
  })
})
</script>
<style lang="scss">
// @import './right.scss';
// @import '../../styles/variables.module.scss';
</style>
<style lang="scss" scoped>

$drawerBoxWidth: 28px;
.rightAll{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding: 20px;
    box-sizing: border-box;
    .right-header{
        height: 80px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .header-title{
        font-size: 24px;
        color: #333;
        font-weight: 500;
    }
    .header-user{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #903B13;
        font-size: 14px;
        .user-img{
            width: 30px;
            height: 30px;
        }
        .user-name{
            margin: 0 10px;
        }
        .home-btn{
            padding: 0 10px;
            cursor: pointer;
            border-left: 1px solid #903B13;
            border-right: 1px solid #903B13;
        }
        .quit-btn{
            padding-left: 10px;
            border-left: 1px solid #903B13;
            cursor: pointer;
        }
    }
    .right-talk{
        width: 100%;
        height: calc(100% - 30px);
        margin: 20px 0;
        overflow: auto;
    }
    .right-question{
        width: 100%;
        height: 160px;
        background: #FAFAFA;
        border: 1px solid #DDDDDD;
        position: relative;
        .sendButBox {
          position: absolute;
          bottom: 20px;
          right: 10px;
        }
    }
}
.sendButBox {
    cursor: pointer;
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: end;
    align-items: center;
    .btn{
      width:80px;
      height: 40px;
      background: #DD0003;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      color: #fff;
    }
    .noBut {
      cursor: not-allowed;
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 8px;
      opacity: 0.6;
      background-image: url('../../../../assets/img/sendBut.png');
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
}
.sendButTip {
    font-size: 12px;
    color: #a09f9f;
    margin-right: 8px;
}
:deep(.el-textarea .el-textarea__inner){
  height: 160px!important;
}
</style>