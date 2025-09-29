<template>
  <div class="homeView">
    <!-- 头部用户区域 -->
    <div class="header-user">
      <img src="../assets/img/userImg.png" class="user-img" />
      <div class="user-name">{{ userInfo }}</div>
      <div class="quit-btn" @click="quitLogin">退出</div>
    </div>

    <!-- 标题区 -->
    <div class="titleArea">
      <div class="chzn">习近平经济思想研究学术阐释数据库</div>
      <div class="eng">Academic Interpretation Database of Xi Jinping's Economic Thought</div>
    </div>

    <!-- 导航栏 -->
    <div class="navBar">
      <div class="bar" @click="returnHomePage">政治原则</div>
      <div class="bar" @click="returnHomePage">五大支柱</div>
      <div class="bar" @click="returnHomePage">六个着力点</div>
      <div class="bar" @click="returnHomePage">国际化</div>
      <div class="bar" @click="returnHomePage">方法论</div>
    </div>
    <div class="navBarShadow"></div>

    <!-- 主体内容：只显示 DetailContent -->
    <div class="mainContent">
      <DetailContent
        v-if="state.detailShow"
        :detailData="state.detailData"
        :routeType="state.routeType"
      />
    </div>

    <!-- 底部按钮：返回首页 & AI助手 -->
    <div class="loginAndAi">
      <div class="laaItem" @click="returnHomePage">
        <div class="laaIcon">
          <HomeFilled style="height: 18px; width: 18px" />
        </div>
        <div class="laaFont">首页</div>
      </div>
      <div class="laaItem" @click="jumpAiHelper">
        <div class="laaIcon">
          <UserFilled style="height: 18px; width: 18px" />
        </div>
        <div class="laaFont">智能检索助手</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Search, UserFilled, HomeFilled } from '@element-plus/icons-vue'
import { docDetail } from '../api/index.js'
import { ElMessage } from 'element-plus'
import DetailContent from './detailContent.vue' // 路径根据实际情况调整

const route = useRoute()
const router = useRouter()

// 用户信息
const userInfo = ref('')

// 页面状态管理
const state = reactive({
  content: '', // 搜索关键词
  detailShow: false,
  detailData: {},
  routeType: '',
})

// 初始化加载详情数据
const fetchDetailData = async (id) => {
    try {
      const res = await docDetail({ id })
      if (res.code === 0 && res.data) {
        state.detailData = res.data
        state.routeType = route.query.type || ''
        state.detailShow = true

        // 外链跳转
        if (res.data.redirectFlag) {
          window.open(res.data.url, '_blank')
        }
      } else {
        ElMessage.error('文章不存在')
        returnHomePage()
      }
    } catch (err) {
      console.error(err)
      ElMessage.error('加载失败，请稍后重试')
      returnHomePage()
    }
}

onMounted(() => {
  const id = route.query.id
  userInfo.value = localStorage.getItem('pro_userInfo') || '游客'
  state.detailShow = false
  if (id) {
    fetchDetailData(id)
  } else {
    ElMessage.warning('缺少文章 ID')
    returnHomePage()
  }
})

// 监听路由变化（比如前进后退）
watch(
  () => route.query.id,
  (newId) => {
    if (newId) {
      fetchDetailData(newId)
    } else {
      returnHomePage()
    }
  }
)

// 返回首页
const returnHomePage = () => {
  router.push({ path: '/homeView', query: {} })
}

// 跳转 AI 助手
const jumpAiHelper = () => {
  router.push({ path: '/aiHelper', query: {} })
}

// 退出登录
const quitLogin = () => {
  localStorage.removeItem('pro_userInfo')
  router.push({ path: '/login' })
}

</script>

<style lang="scss" scoped>
.homeView{
    width: 100%;
    // height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #f4efe0;
    position: relative;
    cursor: default;
    .header-user{
        position: absolute;
        top: 10px;
        right: 10px;
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
        .quit-btn{
            padding-left: 10px;
            border-left: 1px solid #903B13;
            cursor: pointer;
        }
    }
    .loginAndAi{
        position: fixed;
        top: 260px;
        right: 0;
        background-color: #fff;
        display: flex;
        flex-direction: column;
        color: #313131;
        border-radius: 4px;
        .laaItem{
            padding: 12px 5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid transparent;
        }
        .laaItem:hover{
            background-color: #f1f1f1;
            border: 1px solid #fff;
        }
        .laaFont{
            font-size: 12px;
        }
    }
}
.titleArea{
    height: 200px;
    width: 100%;
    background-image: url('../assets/img/headBg.png');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #DD0003;
    .chzn{
        font-size: 32px;
        font-weight: 700;
        margin-bottom: 5px;
    }
    .eng{
        font-size: 16px;
        color: #6e6e6e;
    }
}

.navBar{
    height: 40px;
    width: calc(100% - 30px);
    background-color: #DE0000;
    color: #fff;
    margin-top: 10px;
    display: flex;
    justify-content: space-around;
    .bar{
        width:20%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        color: #fff;
    }
    .barActive{
        background: #A61B1B;
    }
}
.navBarShadow{
    width: calc(100% - 30px);
    height: 8px;
    background-color: rgba(222, 0, 0,0.3);
    margin-bottom: 20px;
}
.mainContent{
    width: calc(100% - 100px);
    height: calc(100% - 260px);
    display: flex;
    justify-content: center;
    background-color: #f4efe0;
}
</style>