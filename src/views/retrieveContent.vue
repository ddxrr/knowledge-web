<template>
    <!-- 检索内容 -->
    <div class="retrieve">
        <div class="filterArea">
            <div class="unfoldArea" :class="state.whetherExpandFilter?'unfoldAreaBorderLine':''">
                <div class="commonChooseAll">
                    <div class="commonItem">
                        <div class="commonTit">结果排序：</div>
                        <div class="commonChoose" :class="state.resultSort=='relevance'?'selectedTag':''" @click="chooseResultSort('relevance')">按相关度</div>
                        <div class="commonChoose" :class="state.resultSort=='date'?'selectedTag':''" @click="chooseResultSort('date')">按日期</div>
                    </div>
                    <div class="commonItem">
                        <div class="commonTit">搜索排序：</div>
                        <div class="commonChoose" :class="state.searchSort=='title'?'selectedTag':''" @click="chooseRearchSort('title')">标题</div>
                        <div class="commonChoose" :class="state.searchSort=='content'?'selectedTag':''" @click="chooseRearchSort('content')">内容</div>
                    </div>
                    <div class="commonItem">
                        <div class="commonTit">时间排序：</div>
                        <div class="commonChoose" :class="state.timeSort=='asc'?'selectedTag':''" @click="chooseTimeSort('asc')">顺序</div>
                        <div class="commonChoose" :class="state.timeSort=='desc'?'selectedTag':''" @click="chooseTimeSort('desc')">逆序</div>
                    </div>
                </div>
                <div class="expandBtn" v-show="!state.whetherExpandFilter" @click="expandFilterChooseType">
                    <div class="btnFont">展开</div>
                    <div class="btnIcon">
                        <ArrowDown style="width:12px;height:12px"/>
                    </div>
                </div>
            </div>
            <div class="expandArea" v-show="state.whetherExpandFilter">
                <div class="commonItem expandItem">
                    <div class="commonTit">时间范围：</div>
                    <div class="commonChoose" :class="!state.timeRange?'selectedTag':''" @click="chooseTimeRange('')">全部时间</div>
                    <div class="commonChoose" :class="state.timeRange=='year'?'selectedTag':''" @click="chooseTimeRange('year')">一年内</div>
                    <div class="commonChoose" :class="state.timeRange=='month'?'selectedTag':''" @click="chooseTimeRange('month')">一月内</div>
                    <div class="commonChoose" :class="state.timeRange=='week'?'selectedTag':''" @click="chooseTimeRange('week')">一周内</div>
                    <el-popover
                        class="box-item"
                        placement="right"
                        trigger="click"
                        :visible="state.customTimeShow"
                        popper-class="custom-time-popper"
                    >
                        <template #reference>
                            <div class="commonChoose" :class="state.timeRange=='custom'?'selectedTag':''" @click="chooseTimeRange('custom')">
                                <span v-if="state.customTimeList.length==0">自定义</span> 
                                <span v-else>{{state.customTimeList[0]}}&nbsp;至&nbsp;{{state.customTimeList[1]}}</span>
                            </div>
                        </template>
                        <div class="date-area">
                            <el-date-picker
                                v-model="state.customTimeList"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="起始时间"
                                end-placeholder="结束时间"
                                size="small"
                                value-format="YYYY-MM-DD"
                                format="YYYY-MM-DD"
                                clearable
                                @change="customDateSelect"
                                @clear="clearDateSelect"
                            />
                        </div>
                    </el-popover>
                </div>
                <div class="commonItem expandItem">
                    <div class="commonItemSpec" :class="!state.whetherExpandTopic?'commonItemSpecExpand':''">
                        <div class="commonTit">研究主题：</div>
                        <div class="commonChooseSpec">
                            <div class="commonChooseMargin" 
                                v-for="item in state.themeList"
                                :key="item"
                                :class="state.theme==item.label?'selectedTag':''"
                                @click="chooseTheme(item.label)"
                            >
                                {{ item.label }}
                            </div>
                        </div>
                        <div class="expandBtnSpec" @click="expandResearchTopic">
                            <div class="btnFont">{{ state.whetherExpandTopic?'收起':'展开'}}</div>
                            <div class="btnIcon">
                                <ArrowDown style="width:12px;height:12px" v-show="!state.whetherExpandTopi"/>
                                <ArrowUp style="width:12px;height:12px" v-show="state.whetherExpandTopi"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="commonItem expandItem">
                    <div class="commonTit">发表时间：</div>
                    <div class="commonChoose" 
                        v-for="el in state.yearList"
                        :key="el"
                        :class="state.year==el.value?'selectedTag':''"
                        @click="chooseYear(el.value)"
                    >
                        {{ el.label }}
                    </div>
                </div>
                <div class="commonItem expandItem">
                    <div class="commonTit">资源类型：</div>
                    <div class="commonChoose" :class="!state.sourceType?'selectedTag':''" @click="chooseSourceType('')">全部</div>
                    <div class="commonChoose" :class="state.sourceType==1?'selectedTag':''" @click="chooseSourceType(1)">期刊</div>
                    <div class="commonChoose" :class="state.sourceType==2?'selectedTag':''" @click="chooseSourceType(2)">报纸</div>
                </div>
                <div class="btnArea">
                    <div class="btnAreaGroup">
                        <div class="btnSingle btnSingleActive" @click="startSearch">开始搜索</div>
                        <div class="btnSingle" @click="clearSearchParam">清除筛选</div>
                    </div>
                    <div class="expandBtn" v-show="state.whetherExpandFilter" @click="expandFilterChooseType">
                        <div class="btnFont">收起</div>
                        <div class="btnIcon">
                            <ArrowUp style="width:12px;height:12px"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="contentArea">
            <div class="contentMain" v-if="state.contentData?.length!==0">
                <div class="contentItem" v-for="item in state.contentData" :key="item.id">
                    <div class="contItemTit">
                        <span class="citFont" v-html="highlightKeyword(item.title)" @click="showDetailPage(item)"></span>
                        <div class="citTime">{{ item.pubDate }}</div>
                    </div>
                    <div class="contItemDetail">{{ item.summary }}</div>
                    <div class="topicContent">
                        <div>研究主题：</div>
                        <div class="contTopicAll">
                            {{ item.keyword||'-' }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="contentMainEmpty" v-else>暂无内容</div>
        </div>
        <div class="pageArea" v-if="state.contentData?.length!==0">
            <el-pagination 
                background 
                layout="prev, pager, next" 
                :total="state.total"
                :page-size="state.pageSize"
                :current-page="state.pageNum"
                @current-change="handleCurrentChange"
                @prev-click="handlePrevClick"
                @next-click="handleNextClick"
            />
        </div>
        <div class="endNationalEmblem">
            <img :src="Guohui" class="endImg">
            <div class="endFont">版权所有&nbsp;京ICP&nbsp;XXXXXXXXXXX号</div>
        </div>

    </div>
</template>
<script setup>
import { onMounted, reactive,onUnmounted,ref,computed, nextTick } from 'vue'
import Guohui from '../assets/img/guohui.png'
import { ArrowDown  } from '@element-plus/icons-vue'
import { ArrowUp  } from '@element-plus/icons-vue'
import { getSearchAnswer } from '../api/index.js'
const emit = defineEmits(['showDetailPage','clearSelectedTypeAndContent']);
const props = defineProps({
  searchContent: String,
  currentType:[String,Number]
})
const state = reactive({
    whetherExpandFilter:false,
    whetherExpandTopic:false,
    contentData:[],
    themeList:[
        {
            value:'',
            label:'全部',
        },
        {
            value:1,
            label:'社会主义',
        },
        {
            value:2,
            label:'政治经济学',
        },
        {
            value:3,
            label:'方法论',
        },
        {
            value:4,
            label:'唯物史观',
        },
        {
            value:5,
            label:'唯物辩证法',
        },
        {
            value:6,
            label:'实践认识论',
        },
        {
            value:7,
            label:'社会主义现代化建设',
        },
        {
            value:8,
            label:'发展',
        },
        {
            value:9,
            label:'安全',
        },
        {
            value:10,
            label:'新发展理念',
        },
        {
            value:11,
            label:'总体国家安全观',
        },
        {
            value:12,
            label:'人类命运共同体',
        },
        {
            value:13,
            label:'对外援助',
        },
        {
            value:14,
            label:'一带一路',
        },
        {
            value:15,
            label:'国际合作',
        },
    ],
    yearList:[
        {
            value:'',
            label:'全部'
        },
        {
            value:2025,
            label:'2025'
        },
        {
            value:2024,
            label:'2024'
        },
        {
            value:2023,
            label:'2023'
        },
        {
            value:2022,
            label:'2022'
        },
        {
            value:2021,
            label:'2021'
        },
        {
            value:2020,
            label:'2020'
        },
        {
            value:2019,
            label:'2019'
        },
        {
            value:2018,
            label:'2018'
        },
        {
            value:2017,
            label:'2017'
        },
    ],
    resultSort:'relevance',//结果排序-相关度relevance,⽇期date
    searchSort:'title',//搜索排序-title标题,content内容
    timeSort:'asc',//时间排序-asc顺,desc逆
    startDate:'',//开始时间
    endDate:'',//截⽌时间
    theme:'全部',//主题
    year:'',//发表年份
    sourceType:'',//资源类型-1-期刊 2-报纸
    pageNum:1,//页码
    pageSize:10,//页数量
    total:0,//分页
    timeRange:'',//时间范围
    searchParam:{},//搜索参数
    customTimeShow:false,//自定义时间弹窗
    customTimeList:[],//自定义时间
})
onMounted(()=>{
    state.whetherExpandFilter = false
})
//展开筛选的全部条件
const expandFilterChooseType = () => {
    state.whetherExpandFilter = !state.whetherExpandFilter
    if(!state.whetherExpandFilter){
        state.customTimeShow = false//自定义时间弹窗
    }
}
//展开研究主题
const expandResearchTopic = () => {
    state.whetherExpandTopic = !state.whetherExpandTopic
}
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
//获取当前日期
const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today);
};
//获取当前日期-1年
const getOneYearAgoDate = () => {
    const now = new Date();
    now.setFullYear(now.getFullYear() - 1); // 减去一年
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 月份是从0开始的
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
//获取当前日期-1月
const getOneYearMonthDate = () => {
    const today = new Date();
    const prevMonthDate = new Date(today);
    prevMonthDate.setMonth(today.getMonth() - 1);
    return formatDate(prevMonthDate);
};
//获取当前日期-1周
const getOneYearWeekDate = () => {
    const today = new Date();  
    const prevWeekDate = new Date(today);
    prevWeekDate.setDate(today.getDate() - 7);
    return formatDate(prevWeekDate);
};
//选择结果排序
const chooseResultSort = obj => {
    state.resultSort = obj
}
//选择搜索排序
const chooseRearchSort = obj => {
    state.searchSort = obj
}
//选择时间排序
const chooseTimeSort = obj => {
    state.timeSort = obj
}
//选择主题
const chooseTheme = obj => {
    // state.theme = obj=='全部'?'':obj
    state.theme = obj
}
//选择资源
const chooseSourceType = obj => {
    state.sourceType = obj
}
//选择发表年份
const chooseYear = obj => {
    state.year = obj
}
const customDateSelect = val => {
    if(!val) return
    state.startDate = val[0]
    state.endDate = val[1]
    state.customTimeShow = false
}
const clearDateSelect = () => {
    state.customTimeList = []
    state.startDate = ''
    state.endDate = ''
    state.timeRange = ''
    state.customTimeShow = false
}
//选择时间范围
const chooseTimeRange = obj => {
    state.timeRange = obj
    if(obj == 'custom'){
        state.customTimeShow=!state.customTimeShow
    }
    switch (obj) {
        case '':
            state.startDate = ''
            state.endDate = ''
            break;
        case 'year':
            state.startDate = getOneYearAgoDate()
            state.endDate = getCurrentDate()
            break;
        case 'month':
            state.startDate = getOneYearMonthDate()
            state.endDate = getCurrentDate()
            break;
        case 'week':
            state.startDate = getOneYearWeekDate()
            state.endDate = getCurrentDate()
            break;
        case 'custom':
            break;
    
        default:
            break;
    }
}
const filteredArticles = computed(() => {
  if (!props.searchContent) return state.contentData;
  return state.contentData.filter(article => 
    article.title.toLowerCase().includes(props.searchContent.toLowerCase())
  );
});

function highlightKeyword(text) {
  if (!props.searchContent) return text;
  
  const regex = new RegExp(props.searchContent, 'gi');
  return text.replace(regex, match => 
    `<span style="color: red; font-weight: bold">${match}</span>`
  );
}
//搜索
const searchOper = () => {
    getSearchAnswer(state.searchParam).then(res => {
        state.contentData = res.data
        state.total = Number(res.totalSize) 
    })
}
//开始搜索
const startSearch = () => {
    state.searchParam = {
        content:props.searchContent,//检索内容
        resultSort:state.resultSort,//结果排序-相关度relevance,⽇期date
        searchSort:state.searchSort,//搜索排序-title标题,content内容
        timeSort:state.timeSort,//时间排序-asc顺,desc逆
        startDate:state.startDate,//开始时间
        endDate:state.endDate,//截⽌时间
        theme:state.theme=='全部'?'':state.theme,//主题
        year:state.year,//发表年份
        sourceType:state.sourceType,//资源类型-1-期刊 2-报纸
        pageNum:state.pageNum,//页码
        pageSize:state.pageSize,//页数量
        type:props.currentType,
    }
    searchOper()
}
//清除筛选
const clearSearchParam = () => {
    state.resultSort = 'relevance',//结果排序-相关度relevance,⽇期date
    state.searchSort = 'title',//搜索排序-title标题,content内容
    state.timeSort = 'asc',//时间排序-asc顺,desc逆
    state.startDate = '',//开始时间
    state.endDate = '',//截⽌时间
    state.theme = '全部',//主题
    state.year = '',//发表年份
    state.sourceType = '',//资源类型-1-期刊 2-报纸
    state.pageNum = 1,//页码
    state.pageSize = 10,//页数量
    state.timeRange = ''
    state.customTimeList = []
    emit('clearSelectedTypeAndContent')
    nextTick(()=>{
        startSearch()
    })
}
//搜索
const searchContent = param => {
    state.searchParam = {
        content:param.content,//检索内容
        resultSort:state.resultSort,//结果排序-相关度relevance,⽇期date
        searchSort:state.searchSort,//搜索排序-title标题,content内容
        timeSort:state.timeSort,//时间排序-asc顺,desc逆
        startDate:state.startDate,//开始时间
        endDate:state.endDate,//截⽌时间
        theme:state.theme=='全部'?'':state.theme,//主题
        year:state.year,//发表年份
        sourceType:state.sourceType,//资源类型-1-期刊 2-报纸
        pageNum:state.pageNum,//页码
        pageSize:state.pageSize,//页数量
        type:param.type,
    }
    searchOper()
}
// 页码变化事件
const handleCurrentChange = (val) => {
    state.pageNum = val
    startSearch()
}
//查看详情
const showDetailPage = item => {
    let objParam = {
        data:item,
        type:'',
    }
    emit('showDetailPage',objParam)
}
defineExpose({
  searchContent
})
</script>
<style lang="scss" scoped>
.retrieve{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    overflow: auto;
}
.filterArea{
    width: 90%;
    background: #fff;
}
.commonChooseSpec{
    width: calc(100% - 180px);
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    color: #333;
}
.commonChooseMargin{
    padding: 2px 8px;
    font-size: 12px;
    margin-right: 10px;
    font-weight: 700;
    margin-bottom: 10px;
    cursor: pointer;
}
.commonSpec{
    display: flex;
    justify-content: space-between;
}
.commonItemSpecExpand{
    max-height: 30px;
    overflow: hidden;
}
.commonItemSpec{
    display: flex;
    align-items: flex-start!important;
    .commonTit{
        color: #000;
        width: 100px;
    }
}
.expandBtnSpec{
    width: 100px;
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    color: #DD0003;
    cursor: pointer;
    .btnFont{
        margin-right: 3px;
    }
}
.commonChooseAll{
    display: flex;
    align-items: center;
}
.commonItem{
    display: flex;
    align-items: center;
    color: #333;
}
.commonTit{
    font-size: 16px;
    font-weight: 700;
    color: #000;
        width: 100px;
}
.commonChoose{
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-right: 10px;
    font-weight: 700;
    color: #333;
    cursor: pointer;
}
.expandItem{
    margin: 10px 0;
}
.selectedTag{
    padding: 2px 8px;
    border-radius: 4px;
    color: #DD0003;
    background-color: #FFE5E4;
}
.expandBtn{
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #333;
    cursor: pointer;
    .btnFont{
        margin-right: 3px;
    }
}
.unfoldArea{
    width: calc(100% - 60px);
    height: 50px;
    margin: 10px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
}
.unfoldAreaBorderLine{
    border-bottom: 1px solid #ddd;
}
.expandArea{
    min-height: 200px;
    width: calc(100% - 60px);
    display: flex;
    flex-direction: column;
    padding: 10px 30px;
}

.contentArea{
    width: 90%;
    background: #fff;
    margin: 20px 0;
    color: #333;
    font-size: 14px;
}
.contentMain{
    width: calc(100% - 60px);
    margin: 20px 30px;
    display: flex;
    flex-direction: column;
    .contentItem{
        width: 100%;
        margin: 10px 0;
        border-bottom: 1px solid #DDDDDD;
        display: flex;
        flex-direction: column;
        .contItemTit{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
            .citFont{
                font-weight: 700;
                color: #000;
                cursor: pointer;
            }
        }
        .contItemDetail{
            width: calc(100% - 100px);
            text-align: left;
            display: -webkit-box;
            -webkit-line-clamp: 3; /* 控制显示行数 */
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 10px 0;
        }
        .topicContent{
            width: calc(100% - 100px);
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            .contTopicAll{
                width: calc(100% - 100px);
                white-space: nowrap; /* 防止文本换行 */
                overflow: hidden; /* 隐藏溢出的内容 */
                text-overflow: ellipsis; /* 显示省略符号来代表被修剪的文本 */
                text-align: left;
            }
        }
    }
}
.contentMainEmpty{
    width: calc(100% - 60px);
    height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.btnArea{
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .btnAreaGroup{
        display: flex;
        align-items: center;
    }
    .btnSingle{
        padding: 3px 10px;
        color: #DD0003;
        background-color: #FFEDED;
        border: 1px solid #DD0003;
        font-size: 14px;
        border-radius: 2px;
        margin: 10px 10px 20px 0;
        cursor: pointer;
    }
    .btnSingleActive{
        background-color: #DD0003;
        color: #fff;
    }
}
.pageArea{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}
:deep(.el-pagination.is-background .el-pager li.is-active){
    background-color: transparent;
    border: 1px solid #DD0003;
    color: #DD0003;
}
:deep(.el-pagination.is-background .btn-next){
    background-color: transparent;
    border: 1px solid #999;
}
:deep(.el-pagination.is-background .btn-prev){
    background-color: transparent;
    border: 1px solid #999;

}
:deep(.el-pagination.is-background .el-pager li){
    background-color: transparent;
    border: 1px solid #999;

}
.date-area{
    display: flex;
    flex-direction: column;
    .date-font{
        margin-bottom: 10px;
    }
}
</style>
<style lang="scss">
.custom-time-popper{
    min-width: 400px!important;
    // min-height: 100px;
}
</style>