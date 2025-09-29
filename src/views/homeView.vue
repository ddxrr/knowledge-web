<template>
    <div class="homeView">
        <div class="header-user">
            <img src="../assets/img/userImg.png" class="user-img">
            <div class="user-name">{{userInfo}}</div>
            <div class="quit-btn" @click="quitLogin">退出</div>
        </div>
        <div class="titleArea">
            <div class="chzn">习近平经济思想研究学术阐释数据库</div>
            <div class="eng">Academic Interpretation Database of Xi Jinping's Economic Thought</div>
            <div class="search">
                <div :class="state.moduleShow?'input':'inputTypeB'">
                    <el-input
                        v-model="state.content"
                        size="large"
                        placeholder="请输入检索关键词"
                        clearable
                        @clear="clearSearch"
                    >
                        <template #suffix>
                            <div class="searchSet" @click="homeSearch">
                                <Search style="width:16px;height:16px;"/>
                            </div>
                        </template>
                    </el-input>
                </div>
                <div class="operbtn" v-show="state.moduleShow" @click="homeSearch">高级搜索</div>
            </div>
            <div class="popularSearch">
                <div class="pstit">热门搜索:</div>
                <div class="searchItem">
                    <div class="item" v-for=" item in state.popularAll" :key="item.id" @click="popularsearch(item)">
                        {{ item.content}}
                    </div>
                </div>
            </div>
        </div>
        <div class="navBar">
            <div class="bar" :class="state.currentMoreIndex==1?'barActive':''" @click="goTo('poliPrinciples')">政治原则</div>
            <div class="bar" :class="state.currentMoreIndex==2?'barActive':''" @click="goTo('fivePillar')">五大支柱</div>
            <div class="bar" :class="state.currentMoreIndex==3?'barActive':''" @click="goTo('sixPoint')">六个着力点</div>
            <div class="bar" :class="state.currentMoreIndex==4?'barActive':''" @click="goTo('international')">国际化</div>
            <div class="bar" :class="state.currentMoreIndex==5?'barActive':''" @click="goTo('methodology')">方法论</div>
        </div>
        <div class="navBarShadow"></div>
        <div class="mainContent" @click="handleClick" @mousedown="handleMouseDown" @mousemove="handleMouseMove">
            <ModuleContent
                v-if="state.moduleShow"
                @showMoreContent="showMoreContent"
                @showDetailPage="showDetailPage"
                ref="contentRef"
            />
        </div>
        <div class="loginAndAi">
            <div class="laaItem" v-if="!state.moduleShow">
                <div class="laaIcon" @click="returnHomePage">
                    <!-- <UserFilled style="height:18px;width:18px"/> -->
                    <HomeFilled style="height:18px;width:18px;"/>
                </div>
                <div class="laaFont">首页</div>
            </div>
            <div class="laaItem" @click="jumpAiHelper">
                <div class="laaIcon">
                    <UserFilled style="height:18px;width:18px"/>
                </div>
                <div class="laaFont">智能检索助手</div>
            </div>
        </div>
    </div>
</template>
<script setup>
import ModuleContent from './moduleContent.vue'
import RetrieveContent from './retrieveContent.vue'
import DetailContent from './detailContent.vue'
import { Search } from '@element-plus/icons-vue'
import { UserFilled } from '@element-plus/icons-vue'
import { nextTick, onMounted, reactive,ref } from 'vue'
import { useRouter } from 'vue-router'
import { docDetail } from '../api/index.js'
import { ElMessage } from 'element-plus';
const router = useRouter()
const retrieveRef = ref(null)
const state = reactive({
    popularAll:[
        {
            id:1,
            content:'新发展阶段'
        },
        {
            id:2,
            content:'制造业和实体经济'
        },
        {
            id:3,
            content:'经济全球化发展'
        },
        {
            id:4,
            content:'统筹好总供给总需求'
        },
    ],
    content:'',//搜索内容
    moduleShow:true,
    detailData:{},//详情数据
    currentMoreIndex:'',//当前从第几个模块点击的更多
    currentType:''
})
const userInfo = ref('')
const contentRef = ref(null)
// 是否发生过点击
const hasClicked = ref(false)
// 是否发生过鼠标移动
const hasMoved = ref(false)
//识别到页面点击-仅对首页内容区域有效
const handleClick = (event) => {
    if(!state.moduleShow) return
    hasClicked.value = true
    state.currentMoreIndex = ''
}
//检测到滑动-仅对首页内容区域有效
const handleMouseMove = (event) => {
    if(!state.moduleShow) return
    hasMoved.value = true
    state.currentMoreIndex = ''
}
const goTo = (id) => {
    if(state.moduleShow){
        // 调用子组件暴露的方法
        contentRef.value?.scrollToSection(id)
    }
    switch (id) {
        case 'poliPrinciples':
            state.currentMoreIndex = 1
            break;
        case 'fivePillar':
            state.currentMoreIndex = 2
            break;
        case 'sixPoint':
            state.currentMoreIndex = 3
            break;
        case 'international':
            state.currentMoreIndex = 4
            break;
        case 'methodology':
            state.currentMoreIndex = 5
            break;
        default:
            break;
    }
}
onMounted(()=>{
    state.currentType = ''
    state.currentMoreIndex = ''
    state.moduleShow = true
    //登录人
    userInfo.value = localStorage.getItem('pro_userInfo')
})
//更多
const showMoreContent = index => {
    state.currentMoreIndex = index
    state.currentType = handelCurrentType(state.currentMoreIndex)
    router.push({
        path: '/retrieve',
        query: {
            currentMoreIndex:index,
            content:state.content,
            type:state.currentType,
        },
    })
}
//查看详情
const showDetailPage = obj => {
    if(!obj.data.id){ return } 
    router.push({
        path: '/info',
        query: { id: obj.data.id },
    })
}
//跳转智能检索助手
const jumpAiHelper = () => {
    router.push({
        path:'/aiHelper',
        query:{}
    })
}
//根据index去的当前type值
const handelCurrentType = index => {
    switch (index) {
        case 0:
            return 6
        case 1:
            return 5
        case 2:
            return 4
        case 3:
            return 3
        case 4:
            return 2
        case 5:
            return 1
        case '':
            return ''
        default:
            break;
    }
}
//搜索方法
const searchOper = () => {
    state.currentType = handelCurrentType(state.currentMoreIndex)
    let param ={
        content:state.content,
        type:state.currentType,
    }
    nextTick(()=>{
        retrieveRef.value.searchContent(param)
    })
}
//首页搜索
const homeSearch = () => {
    router.push({
        path: '/retrieve',
        query: { 
            currentMoreIndex:state.currentMoreIndex,
            content:state.content,
            type:state.currentType,
        },
    })
}
//热门搜索
const popularsearch = item => {
    state.content = item.content
    homeSearch()
}
//清空筛选时type和content置空
const clearSelectedTypeAndContent = () => {
    state.content = ''
    state.currentType = ''
    state.currentMoreIndex = ''
}
//返回首页
const returnHomePage = () => {
    // state.moduleShow = true
    // state.retrieveShow = false
    state.currentType = ''
    state.currentMoreIndex = ''
    router.push({
        path: '/homeView',
        query:{}
    })
}
//退出
const quitLogin = () => {
    localStorage.removeItem('pro_userInfo')
    router.push({
        path:'/login',
        query:{}
    })
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
.search{
    width: 440px;
    display: flex;
    align-items: center;
    margin: 15px 0;
    justify-content: space-between;
    .input{
        :deep(.el-input__inner){
            height: 30px;
            width: 260px;
            border: none;
            border-right: 1px solid rgba(224, 224,224,0.42);
            background-color: #fff;
            padding: 0 10px;
            margin: 5px 0;
        }
        :deep(.el-input__wrapper){
            height: 40px;
            width: 320px;
            border: 1px solid rgba(224, 224,224,0.42);
            background-color: #fff;
            display: flex;
            align-items: center;
        }
        .searchSet{
            width: 40px;
            padding: 0 10px;
            box-sizing: border-box;
            display:flex;
            justify-content: center;
            align-items: center;
            color: #424545;
            cursor: pointer;
            .searchFont{
                margin-left: 5px;
            }
        }
    }
    .inputTypeB{
        :deep(.el-input__inner){
            height: 30px;
            width: 335px;
            border: none;
            border-right: 1px solid rgba(224, 224,224,0.42);
            background-color: #fff;
            padding: 0 10px;
            margin: 5px 0;
        }
        :deep(.el-input__wrapper){
            height: 40px;
            width: 440px;
            border: 1px solid rgba(224, 224,224,0.42);
            background-color: #fff;
            display: flex;
            align-items: center;
        }
        .searchSet{
            width: 80px;
            padding: 0 10px;
            box-sizing: border-box;
            display:flex;
            justify-content: center;
            align-items: center;
            color:#DE0000;
            cursor: pointer;
            .searchFont{
                margin-left: 5px;
            }
        }
    }
    .operbtn{
        width: 60px;
        height: 40px;
        padding: 0 10px;
        background-color: #DE0000;
        border-radius: 2px;
        color: #fff;
        font-size: 14px;
        display:flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }
}
.popularSearch{
    min-width: 440px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    .pstit{
        color: #A34E26;
        margin-right: 10px;
    }
    .searchItem{
        display: flex;
        align-items: center;
        .item{
            padding: 3px;
            background-color: rgba(244, 205, 34, 0.3);
            color: #903B13;
            border-radius: 2px;
            margin-right: 5px;
            cursor: default;
        }
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
}
:deep(.el-input){
    --el-input-hover-border: transparent;
    --el-input-focus-border: transparent;
    --el-input-focus-border-color: transparent;
}
</style>