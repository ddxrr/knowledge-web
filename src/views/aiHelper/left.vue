<template>
    <div class="leftAll">
        <div class="returnBtn" @click="returnHome">
            <el-icon><HomeFilled /></el-icon>
        </div>
        <div class="left-all-top">
            <div class="logo-group">
                <div class="logo-img">
                    <img src="../../assets/img/guohui.png">
                </div>
                <div class="logo-font">
                    <div class="logo-font-top">智能检索助手</div>
                    <div class="logo-font-bot">AI search assistant</div>
                </div>
            </div>
            <div class="add-dialogue" @click="changeAdd">
                <div class="icon">
                    <img src="../../assets/img/addIcon.png">
                </div>
                <div>新建对话</div>
            </div>
        </div>
        <div class="left-all-bot" v-loading="settingsStore_.sessionBoxLoading">
            <div class="bot-title">历史检索</div>
            <div class="bot-history">
                <div class="history-item" v-for="(dialogItem,index) in settingsStore_.sessionList" :key="dialogItem" :class="currentSelectedIndex==index?'history-item-active':''">
                    <img :src="DialogueIcon" class="dialogue-icon">
                    <div class="dialogue-font" @click="changeSessionOne(dialogItem,index)">
                        <div v-if="dialogItem.inputMsg.length>=12">
                            <el-tooltip
                                class="box-item"
                                :content="dialogItem.inputMsg"
                                placement="bottom-start"
                            >
                                <div>{{ dialogItem.inputMsg }}</div>
                            </el-tooltip>
                        </div>
                        <div v-else>{{ dialogItem.inputMsg }}</div>
                    </div>
                    <div class="delete-btn" @click="confirmDel(dialogItem)">
                        <el-icon class="dialogue-icon" >
                            <Delete />
                        </el-icon>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { Plus } from '@element-plus/icons-vue'
import { reactive,onMounted,ref } from 'vue'
import DialogueIcon from '../../assets/img/dialogueIcon.png'
import settingsStore from '../../store/modules/settings.js'
import { deleteSession } from '../../api/index.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const activeSession = ref('') // 点击对应的会话ID
const state = reactive({
    dialogueData:[]
})
const settingsStore_ = settingsStore()
const currentSelectedIndex = ref(-1)
// 新建对话
const changeAdd = () => {
  settingsStore_.$patch({
    showHome: true,
    sessionId: '',
    answerData: {
      answerList: [] // 清空添加的数据
    }
  })
  activeSession.value = ''
  currentSelectedIndex.value = -1
}

// 点击会话
const changeSessionOne = (v,index) => {
  const { id, sessionId } = v
  activeSession.value = id
  settingsStore_.$patch({
    showHome: false,
    sessionId
  })
  // 获取所有对话列表
  settingsStore_.fetchData()
  currentSelectedIndex.value = index
}
// 弹窗确认
const confirmDel = item => {
    ElMessageBox.confirm('确认删除此条会话?','提示',{
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        }
    ).then(() => {
        const { sessionId } = item
        deleteSession({sessionId}).then(res => {
            if (res.code == 0) {
                settingsStore_.getAllHistoryList()
                settingsStore_.showHome = true
                ElMessage({
                    type: 'success',
                    message: '删除成功',
                })
            }
        })

    })
}
//返回首页
const returnHome = () => {
    router.push({
        path:'/homeView',
        query:{}
    })
}
onMounted(() => {
  settingsStore_.getAllHistoryList()
  currentSelectedIndex.value = -1
})
</script>
<style lang="scss" scoped>
.leftAll{
    width: 300px;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    color: #000;
    background: #F9F6F5;
    position: relative;
    .returnBtn{
        position: absolute;
        top: 10px;
        left: 10px;
        width: 20px;
        height: 10px;
        color: #333;
    }
}
.left-all-top{
    width: 100%;
    height: 150px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid #DDDDDD;
    padding: 20px 0;
    box-sizing: border-box;
    .logo-group{
        display: flex;
        align-items: center;
        .logo-img{
            width: 60px;
            height: 60px;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
    .logo-font-top{
        font-size: 20px;
        font-weight: 700;
    }
    .logo-font-bot{
        font-size: 16px;
        font-size: 400;
    }
    .add-dialogue{
        width: 90%;
        padding: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #DD0003;
        background: #FFEDED;
        border: 2px solid #DD0003;
        margin-top: 10px;
        .icon{
            width: 20px;
            height: 20px;
            margin-right: 10px;
            img{
                width: 100%;
                height: 100%;
            }
        }
    }
}
.left-all-bot{
    height: calc(100% - 150px);
    display: flex;
    flex-direction: column;
    .bot-title{
        width: 100%;
        margin: 10px 0;
        display: flex;
        justify-content: flex-start;
        font-size: 16px;
        color: #333333;
    }
    .bot-history{
        width: 100%;
        height: calc(100% - 28px);
        display: flex;
        flex-direction: column;
        overflow: auto;
    }
    .history-item{
        width: 100%;
        height: 56px;
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #333;
        margin-bottom: 6px;
        padding: 16px;
        box-sizing: border-box;
        cursor: pointer;
    }
    .history-item:hover{
        background: #fff;
        .delete-btn{
            opacity: 1;
        }
    }
    .history-item-active{
        background: #fff;
    }
    .dialogue-icon{
        width: 32px;
        height: 32px;
    }
    .dialogue-font{
        width: calc(100% - 64px);
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
        text-align: left;
    }
}
/* 删除按钮默认透明 */
.delete-btn {
    opacity: 0;
    color: #000;
    border: none;
    cursor: pointer;
    font-size: 12px;
    transition: opacity 0.3s, background 0.3s;
}

</style>