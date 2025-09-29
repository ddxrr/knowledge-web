<template>
   <!-- 模块内容 -->
   <div class="module" ref="containerRef">
        <div class="econThought">
            <div class="left">
                <!-- 轮播图 -->
                <div class="loop">
                    <div class="loopImgShow">
                        <div class="loopSwitch">
                            <div class="loopBtn" @click.stop="loopleftRightSwitch('left')">
                                <ArrowLeft style="width:14px;height:14px;"/>
                            </div>
                        </div>
                        <div class="loopImg">
                            <div class="itemImg">
                                <img :src="state.currentLoopImg" class="calImg">
                            </div>
                            <div class="catalogue">
                                <div class="catalogueMain">
                                    <div 
                                        class="catalogueItem" 
                                        v-for=" (circleItem,cindex) in 4" :key="cindex" 
                                        :class="cindex == state.currentLoopIndex?'itemActive':''"
                                        @click="selectedLoopItemImg(cindex)"
                                    ></div>
                                </div>
                            </div>
                        </div>
                        <div class="loopSwitch">
                            <div class="loopBtn" @click.stop="loopleftRightSwitch('right')">
                                <ArrowRight style="width:14px;height:14px;"/>
                            </div>
                        </div>
                        <div class="loopImgShowBotshadow"></div>
                    </div>
                    <div class="titFont">{{ state.currentLoopText }}</div>
                </div>
            </div>
            <div class="right">
                <div class="commonTit">
                    <div class="ctLeft">
                        <div class="line"></div>
                        <div class="font">习近平经济思想</div>
                    </div>
                    <div class="ctRight" @click="emit('showMoreContent',0)">
                        <div class="more">更多</div>
                        <ArrowRight style="width:14px;height:14px;"/>
                    </div>
                </div>
                <div class="etMain">
                    <div class="etMainItem" v-for="etItem in state.econThoughtData" :key="etItem.id" @click="showDetailPage(etItem,6)">
                        <div class="leftGroup">
                            <div class="smallCricle"></div>
                            <div class="etText">{{ etItem.title }}</div>
                            <div class="rightTime">
                                {{ etItem.pubDate }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="poliPrinciples" id="poliPrinciples">
            <div class="commonTit">
                <div class="ctLeft">
                    <div class="line"></div>
                    <div class="font">政治原则</div>
                </div>
                <div class="ctRight" @click="emit('showMoreContent',1)">
                    <div class="more">更多</div>
                    <ArrowRight style="width:14px;height:14px;"/>
                </div>
            </div>
            <div class="ppMain">
                <div class="switchArea"> 
                    <div class="switchItem" :class="state.switchPoliIndex==0?'switchActive':''" @click="switchPoliPrinciples('first')">党对经济工作的全面指导</div>
                    <div class="switchItem" :class="state.switchPoliIndex==1?'switchActive':''" @click="switchPoliPrinciples('second')">以人民为中心的发展思想</div>
                </div>
                <div class="mainCont">
                    <div class="commonItem">
                        <div class="itemTit">中文文献</div>
                        <div class="itemCont" v-for="ppItem1 in state.politicalItemData.chineseDoc" :key="ppItem1" @click="showDetailPage(ppItem1,5)">
                            <div class="commonItemLeft">
                                <div class="miniCircle"></div>
                                <div class="contFont">{{ ppItem1.title }}</div>
                            </div>
                            <div class="commonItemRight">
                                {{ ppItem1.pubDate }}
                            </div>
                        </div>
                    </div>
                    <div class="commonItem" v-if="state.politicalItemData.threeNews?.length!==0">
                        <div class="itemTit">三报一刊</div>
                        <div class="itemCont" v-for="ppItem2 in state.politicalItemData.threeNews" :key="ppItem2" @click="showDetailPage(ppItem2,5)">
                            <div class="commonItemLeft">
                                <div class="miniCircle"></div>
                                <div class="contFont">{{ ppItem2.title }}</div>
                            </div>
                            <div class="commonItemRight">
                                {{ ppItem2.pubDate }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="fivePillar" id="fivePillar">
            <div class="commonTit">
                <div class="ctLeft">
                    <div class="line"></div>
                    <div class="font">五大支柱</div>
                </div>
                <div class="ctRight">
                    <div class="more" @click="emit('showMoreContent',2)">更多</div>
                    <ArrowRight style="width:14px;height:14px;"/>
                </div>
            </div>
            <div class="fpMain">
                <div class="fpSwitch">
                    <div class="fpSwitchItem" :class="state.switchFivePillarIndex==0?'fpSwitchActive':''" @click="switchFivePillar(0)">新发展阶段</div>
                    <div class="fpSwitchItem" :class="state.switchFivePillarIndex==1?'fpSwitchActive':''" @click="switchFivePillar(1)">新发展理念</div>
                    <div class="fpSwitchItem" :class="state.switchFivePillarIndex==2?'fpSwitchActive':''" @click="switchFivePillar(2)">新发展格局</div>
                    <div class="fpSwitchItem" :class="state.switchFivePillarIndex==3?'fpSwitchActive':''" @click="switchFivePillar(3)">新质生产力</div>
                    <div class="fpSwitchItem" :class="state.switchFivePillarIndex==4?'fpSwitchActive':''" @click="switchFivePillar(4)">高质量发展</div>
                </div>
                <div class="fpmainCont">
                    <div class="commonItem" v-if="state.fivePillarItemData.chineseDoc?.length !== 0">
                        <div class="itemTit">中文文献</div>
                        <div class="itemCont" v-for="fpItem1 in state.fivePillarItemData.chineseDoc" :key="fpItem1" @click="showDetailPage(fpItem1,4)">
                            <div class="commonItemLeft">
                                <div class="miniCircle"></div>
                                <div class="contFont">{{ fpItem1.title }}</div>
                            </div>
                            <div class="commonItemRight">
                                {{ fpItem1.pubDate }}
                            </div>
                        </div>
                    </div>
                    <div class="commonItem" v-if="state.fivePillarItemData.threeNews?.length !== 0">
                        <div class="itemTit">三报一刊</div>
                        <div class="itemCont" v-for="fpItem2 in state.fivePillarItemData.threeNews" :key="fpItem2" @click="showDetailPage(fpItem2,4)">
                            <div class="commonItemLeft">
                                <div class="miniCircle"></div>
                                <div class="contFont">{{ fpItem2.title }}</div>
                            </div>
                            <div class="commonItemRight">
                                {{ fpItem2.pubDate }}
                            </div>
                        </div>
                    </div>
                    <div class="commonItem" v-if="state.fivePillarItemData.englishDoc?.length !== 0">
                        <div class="itemTit">英文文献</div>
                        <div class="itemCont" v-for="fpItem3 in state.fivePillarItemData.englishDoc" :key="fpItem3" @click="showDetailPage(fpItem3,4)">
                            <div class="commonItemLeft">
                                <div class="miniCircle"></div>
                                <div class="contFont">{{ fpItem3.title }}</div>
                            </div>
                            <div class="commonItemRight">
                                {{ fpItem3.pubDate }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="sixPoint" id="sixPoint">
            <div class="commonTit">
                <div class="ctLeft">
                    <div class="line"></div>
                    <div class="font">六个着力点</div>
                </div>
                <div class="ctRight" @click="emit('showMoreContent',3)">
                    <div class="more">更多</div>
                    <ArrowRight style="width:14px;height:14px;"/>
                </div>
            </div>
            <div class="spMain">
                <div class="spItem" v-for="sixItem in state.sixPointData" :key="sixItem.id">
                    <div class="spItemFontArea">
                        <div class="fontAreaTit">
                            <div class="fatLeft">{{ sixItem.docType }}</div>
                            <div class="fatMore" @click="emit('showMoreContent',3)">
                                <div class="more">更多</div>
                                <ArrowRight style="width:14px;height:14px;"/>
                            </div>
                        </div>
                        <div class="crossLine"></div>
                        <div class="fontAreaCont" @click="showDetailPage(sixItem,3)">
                            <span>"</span>
                            <span>{{ sixItem.summary }}</span>
                            <span>"</span>
                        </div>
                        <div class="fontAreaEnd">
                            <div class="faeTo">——</div>
                            <div class="faeFont">
                                <div>《</div>
                                <div class="faeFontMain">{{ sixItem.title }}</div>
                                <div>》</div>
                            </div>
                        </div>
                    </div>
                    <div class="spItemBgArea"></div>
                </div>
            </div>
        </div>
        <div class="international" id="international">
            <div class="commonTit">
                <div class="ctLeft">
                    <div class="line"></div>
                    <div class="font">国际化</div>
                </div>
                <div class="ctRight" @click="emit('showMoreContent',4)">
                    <div class="more">更多</div>
                    <ArrowRight style="width:14px;height:14px;"/>
                </div>
            </div>
            <div class="itMain">
                <div class="itItem" v-for="itItem in state.internationalData" :key="itItem.id">
                    <img :src="itItem.imgUrl" class="itItemImg" @click="emit('showMoreContent',4)">
                    <div class="itItemFont">{{ itItem.docType }}</div>
                </div>
            </div>
        </div>
        <div class="methodology" id="methodology">
            <div class="commonTit">
                <div class="ctLeft">
                    <div class="line"></div>
                    <div class="font">方法论</div>
                </div>
                <div class="ctRight" @click="emit('showMoreContent',5)">
                    <div class="more">更多</div>
                    <ArrowRight style="width:14px;height:14px;"/>
                </div>
            </div>
            <div class="moMain">
                <div class="moItemCont" v-for="mmItem in state.methodologyData" :key="mmItem.id" @click="showDetailPage(mmItem,1)">
                    <div class="commonItemLeft">
                        <div class="miniCircle"></div>
                        <div class="contFont">{{ mmItem.title }}</div>
                    </div>
                    <div class="commonItemRight">
                        {{ mmItem.pubDate }}
                    </div>
                </div>
            </div>
        </div>
        <div class="endNationalEmblem">
            <img :src="Guohui" class="endImg">
            <div class="endFont">版权所有&nbsp;京ICP&nbsp;XXXXXXXXXXX号</div>
        </div>
   </div>
</template>
<script setup>
import { onMounted, reactive,onUnmounted,defineEmits,defineExpose,ref } from 'vue'
import CycleImg1 from '../assets/img/cycleImg1.png'
import CycleImg2 from '../assets/img/cycleImg2.png'
import CycleImg3 from '../assets/img/cycleImg3.png'
import CycleImg4 from '../assets/img/cycleImg4.png'
import ChinaModernization from '../assets/img/chinaModernization.png'
import EconomicGlobalization from '../assets/img/economicGlobalization.png'
import HumanityFate from '../assets/img/humanityFate.png'
import Guohui from '../assets/img/guohui.png'
import { ArrowRight  } from '@element-plus/icons-vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { homeRecommend } from '../api/index.js'
const emit = defineEmits(['showMoreContent','showDetailPage']);
let intervalId = null;
const state = reactive({
    loopImgData:[{
        id:1,
        img:CycleImg1,
        text:'河道视察现场'
    },{
        id:2,
        img:CycleImg2,
        text:'新华网拍摄现场'
    },{
        id:3,
        img:CycleImg3,
        text:'全国生态环境大会讲话'
    },{
        id:4,
        img:CycleImg4,
        text:'出席国内会议现场'
    }],
    econThoughtData:[],
    sixPointData:[],
    internationalData:[],
    methodologyData:[],
    currentLoopImg:'',//当前轮播图片
    currentLoopIndex:0,//当前轮播索引值
    currentLoopText:'',//当前轮播内容标题
    switchPoliIndex:0,//政治原则当前页签
    politicalData:[],//政治原则整体
    politicalItemData:[],//政治原则小模块
    switchFivePillarIndex:0,//五大支柱当前页签
    fivePillarData:[],//五大支柱整体
    fivePillarItemData:[],//五大支柱小模块
})
const containerRef = ref(null)

// 给父组件调用锚点的方法
const scrollToSection = (id) => {
  const element = document.getElementById(id)
  if (element && containerRef.value) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  }
}
//处理政治原则数据条数
const slicePpData = data => {
    if(data.threeNews.length==0){
        data.chineseDoc = data.chineseDoc.length>5?data.chineseDoc.slice(0,5):data.chineseDoc
    }else{
        data.threeNews = data.threeNews.slice(0,1)
        data.chineseDoc = data.chineseDoc.slice(0,2)
    }
    return data
}
//处理政治原则数据
const handlePPDataOper = ppData => {
    let ppFirstArr = {
        chineseDoc:[],
        threeNews:[]
    }
    let ppSecondArr = {
        chineseDoc:[],
        threeNews:[]
    }
    ppData.forEach(ppItem => {
        if(ppItem.docType=='坚持党的全面领导'){
            if(ppItem.docSource==2){
                ppFirstArr.chineseDoc.push(ppItem)
            }else if(ppItem.docSource==1){
                ppFirstArr.threeNews.push(ppItem)
            }
        }
        if(ppItem.docType=='坚持以人民为中心的发展思想'){
            if(ppItem.docSource==2){
                ppSecondArr.chineseDoc.push(ppItem)
            }else if(ppItem.docSource==1){
                ppSecondArr.threeNews.push(ppItem)
            }
        }
    });
    ppFirstArr = slicePpData(ppFirstArr)
    ppSecondArr = slicePpData(ppSecondArr)
    state.politicalData = [ppFirstArr,ppSecondArr]
    state.politicalItemData = state.politicalData[state.switchPoliIndex]
}
//处理五大支柱数量
const sliceFiveData = data => {
    if(data.englishDoc.length==0){
        if(data.threeNews.length==0){
            data.chineseDoc = data.chineseDoc.length>6?data.chineseDoc.slice(0,7):data.chineseDoc
        }else{
            data.threeNews = data.chineseDoc.length==0&&data.threeNews.length>7?data.threeNews.slice(0,8):data.chineseDoc.length!==0?data.threeNews.slice(0,2):data.threeNews
            data.chineseDoc = data.chineseDoc.length>4?data.chineseDoc.slice(0,5):data.chineseDoc
        }
    }else{
        if(data.threeNews.length==0){
            data.chineseDoc = data.chineseDoc.length>5?data.chineseDoc.slice(0,6):data.chineseDoc
        }else{
            data.threeNews = data.threeNews.length>1?data.threeNews.slice(0,2):data.threeNews
            data.chineseDoc = data.chineseDoc.length>3?data.chineseDoc.slice(0,4):data.chineseDoc
        }
    }
    return data
}
//处理五大支柱数据
const handlefiveDataOper = fpData => {
    let fpFirstArr = { chineseDoc:[],threeNews:[],englishDoc:[] }
    let fpSecondArr = { chineseDoc:[],threeNews:[],englishDoc:[] }
    let fpThirdArr = { chineseDoc:[],threeNews:[],englishDoc:[] }
    let fpFourArr = { chineseDoc:[],threeNews:[],englishDoc:[] }
    let fpFiveArr = { chineseDoc:[],threeNews:[],englishDoc:[] }
    fpData.forEach(fpItem => {
        if(fpItem.docType=='新发展阶段'){
            switch (fpItem.docSource) {
                case 1:
                    fpFirstArr.threeNews.push(fpItem)
                    break;
                case 2:
                    fpFirstArr.chineseDoc.push(fpItem)
                    break;
                case 3:
                    fpFirstArr.englishDoc.push(fpItem)
                    break;
                default:
                    break;
            }
        }
        if(fpItem.docType=='新发展理念'){
            switch (fpItem.docSource) {
                case 1:
                    fpSecondArr.threeNews.push(fpItem)
                    break;
                case 2:
                    fpSecondArr.chineseDoc.push(fpItem)
                    break;
                case 3:
                    fpSecondArr.englishDoc.push(fpItem)
                    break;
                default:
                    break;
            }
        }
        if(fpItem.docType=='新发展格局'){
            switch (fpItem.docSource) {
                case 1:
                    fpThirdArr.threeNews.push(fpItem)
                    break;
                case 2:
                    fpThirdArr.chineseDoc.push(fpItem)
                    break;
                case 3:
                    fpThirdArr.englishDoc.push(fpItem)
                    break;
                default:
                    break;
            }
        }
        if(fpItem.docType=='新质生产力'){
            switch (fpItem.docSource) {
                case 1:
                    fpFourArr.threeNews.push(fpItem)
                    break;
                case 2:
                    fpFourArr.chineseDoc.push(fpItem)
                    break;
                case 3:
                    fpFourArr.englishDoc.push(fpItem)
                    break;
                default:
                    break;
            }
        }
        if(fpItem.docType=='高质量发展'){
            switch (fpItem.docSource) {
                case 1:
                    fpFiveArr.threeNews.push(fpItem)
                    break;
                case 2:
                    fpFiveArr.chineseDoc.push(fpItem)
                    break;
                case 3:
                    fpFiveArr.englishDoc.push(fpItem)
                    break;
                default:
                    break;
            }
        }
    });
    state.fivePillarData = [ sliceFiveData(fpFirstArr),sliceFiveData(fpSecondArr),sliceFiveData(fpThirdArr),sliceFiveData(fpFourArr),sliceFiveData(fpFiveArr) ]
    state.fivePillarItemData = state.fivePillarData[state.switchFivePillarIndex]
}
//处理国际化数据
const handleInterDataOper = interData => {
    let arr1 = []
    let arr2 = []
    let arr3 = []
    interData.forEach(item=>{
        if(item.docType=='中国式现代化'){
            arr1.push(item)
        }
        if(item.docType=='人类命运共同体'){
            arr2.push(item)
        }
        if(item.docType=='经济全球化'){
            arr3.push(item)
        }
    })
    state.internationalData = [
        {...arr1[0],imgUrl:ChinaModernization},
        {...arr2[0],imgUrl:HumanityFate},
        {...arr3[0],imgUrl:EconomicGlobalization}
    ]
}
//处理六个着力点数据
const handleSixPointDataOper = sixPointData => {
    //取出六个类型的第一个
    const map = new Map()
    sixPointData.forEach(item => {
        if (!map.has(item.docType)) {
            map.set(item.docType, item)
        }
    })
    state.sixPointData = Array.from(map.values())
} 
//获取首页所有数据
const getAllHomeData = () =>{
    homeRecommend().then(res => {
        if(res.code == 0){
            let data = res.data
            //习近平经济思想
            state.econThoughtData = data['6']
            //政治原则
            let ppData = data['5']
            handlePPDataOper(ppData)
            //五大支柱
            let fpData = data['4']
            handlefiveDataOper(fpData)
            //方法论
            state.methodologyData = data['1']
            //国际化
            let interData = data['2']
            handleInterDataOper(interData)
            //六个着力点
            let sixPointData = data['3']
            handleSixPointDataOper(sixPointData)
        }
    })
}
//政治原则切换
const switchPoliPrinciples = val => {
    state.switchPoliIndex = val=='first'?0:1
    state.politicalItemData = state.politicalData[state.switchPoliIndex]
}
//五大支柱切换
const switchFivePillar = val => {
    state.switchFivePillarIndex = val
    state.fivePillarItemData = state.fivePillarData[state.switchFivePillarIndex]
}
onMounted(()=>{
    state.currentLoopImg = state.loopImgData[0].img
    state.currentLoopText = state.loopImgData[0].text
    intervalId = setInterval(() => {
        state.currentLoopIndex = (state.currentLoopIndex + 1) % state.loopImgData.length;
        state.currentLoopImg = state.loopImgData[state.currentLoopIndex].img;
        state.currentLoopText = state.loopImgData[state.currentLoopIndex].text;
    }, 5000);
    // 获取首页数据
    getAllHomeData()
})
//轮播图向左/右切换
const loopleftRightSwitch = type => {
    switch (type) {
        case 'left':
            state.currentLoopIndex = state.currentLoopIndex==0?3:state.currentLoopIndex-1
            break;
        case 'right':
            state.currentLoopIndex = state.currentLoopIndex==3?0:state.currentLoopIndex+1
            break;
        default:
            break;
    }
    state.currentLoopImg = state.loopImgData[state.currentLoopIndex].img
    state.currentLoopText = state.loopImgData[state.currentLoopIndex].text
}
//选中轮播图片下方圆点
const selectedLoopItemImg = index => {
    state.currentLoopIndex = index
    state.currentLoopImg = state.loopImgData[state.currentLoopIndex].img
    state.currentLoopText = state.loopImgData[state.currentLoopIndex].text
}
 
// 定时器函数，用于循环数组元素
const cycleLoopImgData = () => {
    // 设置定时器，每5秒循环一次
    intervalId = setInterval(() => {
        loopleftRightSwitch('right')
    }, 5000);
}
 
// 组件卸载时清除定时器，防止内存泄漏
onUnmounted(() => {
  clearInterval(intervalId);
});
//查看文章详情
const showDetailPage = (obj,type) => {
    let objParam = {
        data:obj,
        type,
    }
    emit('showDetailPage',objParam)
}
defineExpose({
  scrollToSection
})
</script>
<style lang="scss" scoped>
.module{
    width: 100%;
    height: 100%;
    overflow: auto;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.commonTit{
    width: 100%;
    height: 30px;
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .ctLeft{
        .line{
            width: 5px;
            height: 20px;
            background-color: #DD0003;
            margin-right: 5px;
        }
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 700;
        color: #DD0003;
    }
    .ctRight{
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #DD0003;
        cursor: pointer;
    }
}
.commonItem{
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    margin-left: 15px;
    .itemTit{
        width: 100%;
        display: flex;
        justify-content: flex-start;
        font-weight: 700;
        margin-bottom: 10px;
        color: #000;
    }
    .itemCont{
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .commonItemLeft{
        width: calc(100% - 150px);
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .miniCircle{
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background-color: #333;
            margin-right: 10px;
        }
        .contFont{
            width: 90%;
            color: #333;
            white-space: nowrap; /* 防止文本换行 */
            overflow: hidden; /* 隐藏溢出的内容 */
            text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
            text-align: left;
        }
    }
    .commonItemRight{
        width: 150px;
    }
}
.loop{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .loopImgShow{
        width: 100%;
        height: calc(100% - 40px);
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .loopImgShowBotshadow{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 30px;  
        background-image: url('../assets/img/maskLayer.png');
        background-size: cover;
        background-repeat: no-repeat;
    }
    .loopSwitch{
        width: 40px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .loopBtn{
            height: 40px;
            width: 24px;
            background-color: #999999;
            border-radius: 2px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
        }
    }
    .loopImg{
        width: calc(100% - 80px);
        height: 100%;
        margin: 0 10px;
        position: relative;
        overflow: hidden;
        .itemImg{
            width: 100%;
            height: 100%;
        }
        .calImg{
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .catalogue{
            width: 100%;
            position: absolute;
            bottom: 10px;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;

            .catalogueMain{
                width: 72px;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .catalogueItem{
                width: 8px;
                height: 8px;
                border-radius: 50%;
                margin: 0 3px;
                background-color: #fff;
            }
            .itemActive{
                width: 16px;
                border-radius: 10px;
                background-color: #DE0000;
            }
        }
    }
    .titFont{
        margin-top: 10px;
        color: #333333;
    }
}
.contFont{
    cursor: pointer;
}
.econThought{
    width: 90%;
    height: 300px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    flex-shrink: 0;
    .left{
        width: 49%;
        height: 100%;
        .calImg{
            width: 100%;
            height: 100%;
        }
    }
    .right{
        width: 49%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    .etMain{
        width: 100%;
        height: calc(100% - 45px);
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        overflow: auto;
        // overflow: scroll;
        .etMainItem{
            width: calc(100% - 20px);
            max-height: 48px;
            display: flex;
            justify-content: space-between;
            color: #666;
            margin-bottom: 10px;
        }
        .leftGroup{
            width: 100%;
            display: flex;
            position: relative;
        }
        .rightTime{
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            flex-shrink: 0;
            position: absolute;
            top: 0px;
            right: 0;
            color: #666666;
        }
        .smallCricle{
            width: 4px;
            height: 4px;
            position: absolute;
            top: 10px;
            left: 0;
            border-radius: 50%;
            background-color: #666666;
        }
        .etText{
            margin-left: 10px;
            width: calc(100% - 116px);
            text-align: left;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* 控制显示行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: pointer;
        }
    }
}
.poliPrinciples{
    width:90%;
    height: 310px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    .ppMain{
        width: 100%;
        height: calc(100% - 45px);
        display: flex;
        flex-direction: column;
        background-color: #fff;
    }
    .switchArea{
        height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        .switchItem{
            width: 50%;
            height: 100%;
            font-size: 16px;
            color: #333333;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(221, 0, 3,0.1);
        }
        .switchActive{
            background-color: rgb(221, 0, 3);
            color: #fff;
        }
    }
    .mainCont{
        height: calc(100% - 40px);
        width: calc(100% - 4px);
        box-shadow: 0px 8px 20px 0px #B6B6B63F;
        padding: 15px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        // overflow: auto;
    }
}
.fivePillar{
    width:90%;
    min-height: 300px;
    max-height: 480px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    .fpMain{
        width: 100%;
        height: calc(100% - 35px);
        display: flex;
        flex-direction: column;
        background-color: #fff;
    }
    .fpSwitch{
        height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        .fpSwitchItem{
            width: 20%;
            height: 100%;
            font-size: 16px;
            color: #333333;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: rgba(221, 0, 3,0.1);
        }
        .fpSwitchActive{
            background-color: #DD0003;
            color: #fff;
        }
    }
    .fpmainCont{
        height: calc(100% - 45px);
        width: calc(100% - 4px);
        box-shadow: 0px 8px 20px 0px #B6B6B63F;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        padding: 15px 0;
        overflow: auto;
    }
}
.sixPoint{
    height: 460px;
    width:90%;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    .spMain{
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        .spItem{
            width: 30%;
            height: 200px;
            margin-bottom: 20px;
            position: relative;
        }
        .spItemFontArea{
            width: calc(100% - 45px);
            height: calc(100% - 45px);
            position: absolute;
            top: 0;
            left: 0;
            background-color: #fff;
            z-index: 999;
            border: 1px solid #E2C7C7;
            padding: 15px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .fontAreaTit{
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 16px;
            color: #333333;
            .fatLeft{
                font-weight: 700;
                color: #000;
                width: 80%;
                white-space: nowrap; /* 防止文本换行 */
                overflow: hidden; /* 隐藏溢出的内容 */
                text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
                text-align: left;
            }
            .fatMore{
                display: flex;
                align-items: center;
            }
        }
        .crossLine{
            width: 100%;
            height: 1px;
            background-color: #ddd;
            margin: 8px 0;
        }
        .fontAreaCont{
            text-align: left;
            display: -webkit-box;
            -webkit-line-clamp: 3; /* 控制显示行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 10px 0;
        }
        .fontAreaEnd{
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color:#999;
            .faeTo{
                width: 20px;
            }
            .faeFont{
                max-width: calc(100% - 20px);
                display: flex;
                align-items: center;
            }
            .faeFontMain{
                width: calc(100% - 30px);
                white-space: nowrap; /* 防止文本换行 */
                overflow: hidden; /* 隐藏溢出的内容 */
                text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
                text-align: left;
            }
        }
        .spItemBgArea{
            width: calc(100% - 15px);
            height: calc(100% - 15px);
            position: absolute;
            bottom: 0;
            right: 0;
            background-color: #9B2020;
        }
    }
    .fatMore{
        cursor: pointer;
    }
}
.international{
    width: 90%;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    .itMain{
        width: 100%;
        height: calc(100% - 45px);
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .itItem{
        width: 350px;
        height: 336px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .itItemImg{
            width: 100%;
            height: 300px;
            object-fit: cover;
        }
        .itItemFont{
            font-size: 16px;
            margin-top: 10px;
            color: #333333;
        }
    }
}
.methodology{
    width: 90%;
    height: 310px;
    margin-bottom: 30px;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    .moMain{
        width: calc(100% - 4px);
        height: calc(100% - 45px);
        border: 1px solid #E2C7C7;
        padding: 15px 20px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        .moItemCont{
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .commonItemLeft{
            width: calc(100% - 150px);
            display: flex;
            align-items: center;
            justify-content: flex-start;
            color: #333;
            .miniCircle{
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #494747;
                margin-right: 10px;
                background-color: #DD0003;
            }
            .contFont{
                width: 90%;
                white-space: nowrap; /* 防止文本换行 */
                overflow: hidden; /* 隐藏溢出的内容 */
                text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
                text-align: left;
            }
        }
        .commonItemRight{
            width: 150px;
            color: #666;
        }
    }
    
}
.module::-webkit-scrollbar {
  width: 6px;
}

.modulel::-webkit-scrollbar-thumb {
  background: transparent; /* 绿色滑块 */
  border-radius: 3px;
}

.etMain::-webkit-scrollbar {
  width: 6px;
}

.etMain::-webkit-scrollbar-thumb {
  background: transparent; /* 绿色滑块 */
  border-radius: 3px;
}
</style>