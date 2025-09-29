<template>
    <div class="detailAll">
        <div class="routeArea">
            <div class="lineIcon"></div>
            <div class="routeLayer" v-show="props.routeType">{{ state.routeName }}</div>
            <div class="slashIcon" v-show="props.routeType">/</div>
            <div class="routeLayer">{{props.detailData.title}}</div>
        </div>
        <div class="titleArea" v-show="props.detailData.title">{{props.detailData.title}}</div>
        <div class="userArea" v-show="props.detailData.author">{{props.detailData.author}}</div>
        <div class="AbstractArea" v-show="props.detailData.summary">
            <div class="main">
                {{props.detailData.summary}}
            </div>
        </div>
        <div class="keywordsArea" v-show="props.detailData.keyword">
            <div class="title">关键词：</div>
            <div class="main">
                {{props.detailData.keyword}}
            </div>
        </div>
        <div class="timeArea" v-show="props.detailData.pubDat">
            <div class="title">发表时间：</div>
            <div class="main">
                {{props.detailData.pubDate}}
            </div>
        </div>
        <div class="mainPdfContent" v-if="props.detailData.fileUrl">
            <div class="iframeArea">
                <!-- <pdf-embed :source="props.detailData.fileUrl" style="width: 100%; height: 100%;"></pdf-embed> -->
                <iframe :src="props.detailData.fileUrl" frameborder="0" style="width: 100%; height: 100%;"></iframe>
            </div>
        </div>
        <div class="mainPdfContentEmpty" v-else>
            <!-- <div class="keywordsArea"> -->
                <div class="title">内容：</div>
                <div class="main">
                    暂无文章内容
                </div>
            <!-- </div> -->

        </div>
        <div class="endNationalEmblem">
            <img :src="Guohui" class="endImg">
            <div class="endFont">版权所有&nbsp;京ICP&nbsp;XXXXXXXXXXX号</div>
        </div>
    </div>
</template>
<script setup>
import Guohui from '../assets/img/guohui.png'
import { onMounted, reactive,onUnmounted ,defineProps,defineEmits,} from 'vue'
import PdfEmbed from 'vue-pdf-embed';
const props = defineProps({
  detailData: Object,
  routeType: Number,
})
const state = reactive({
    fileUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
})

onMounted(()=>{
    switch (props.routeType) {
        case 1:
            state.routeName = '⽅法论'
            break;
        case 2:
            state.routeName = '国际化'
            break;
        case 3:
            state.routeName = '六个着⼒点'
            break;
        case 4:
            state.routeName = '五⼤⽀柱'
            break;
        case 5:
            state.routeName = '政治原则'
            break;
        case 6:
            state.routeName = '习近平经济思想'
            break;
    
        default:
            break;
    }
})

</script>
<style lang="scss" scoped>
.detailAll{
    background: #f4efe0;
    width: 100%;
    // height: 100%;
    overflow: auto;
    color: #000;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.routeArea{
    width: 90%;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .lineIcon{
        width: 5px;
        height: 20px;
        margin-right: 5px;
        background-color: #DD0003;
    }
    .routeLayer{
        margin: 0 8px;
        font-size: 16px;
        font-weight: 700;
        color: #DD0003;
    }
}
.titleArea{
    width: 90%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 700;
    color: #000;
}
.userArea{
    width: 90%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    font-size: 14px;
    color: #333;
}
.AbstractArea{
    width: 90%;
    display: flex;
    margin-bottom: 20px;
    text-align: left;
    .title{
        width: 40px;
        font-weight: 700;
        margin-right: 10px;
        color: #000;
    }
    .main{
        width: calc(100% - 50px);
        text-align: left;
        color: #333;
    }
}
.keywordsArea{
    width: 90%;
    display: flex;
    text-align: left;
    margin-bottom: 20px;
    .title{
        max-width: 90px;
        font-weight: 700;
        color: #000;
    }
    .main{
        width: calc(100% - 70px);
        color: #333;
        white-space: nowrap; /* 防止文本换行 */
        overflow: hidden; /* 隐藏溢出的内容 */
        text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
        text-align: left;
    }
}
.timeArea{
    width: 90%;
    display: flex;
    margin-bottom: 20px;
    text-align: left;
    .title{
        width: 90px;
        font-weight: 700;
        color: #000;
    }
    .main{
        width: calc(100% - 100px);
        color: #333;
    }
}
.mainPdfContent{
    width: 90%;
    min-height: 800px;
    background-color: #ABABAB;
    margin-bottom: 20px;
    padding: 30px;
    box-sizing: border-box;
    .iframeArea{
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: #fff;
        display: flex;
        justify-content: flex-start;
        text-align: left;
    }
}
.mainPdfContentEmpty{
    width: 90%;
    height: 600px;
    display: flex;
    .title{
        font-weight: 700;
        color: #000;
    }
}
</style>