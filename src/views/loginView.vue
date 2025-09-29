<template>
<!-- 登录页 -->
    <div class="loginPage">
        <div class="titleArea">
            <div class="chzn">习近平经济思想研究学术阐释数据库</div>
            <div class="eng">Academic Interpretation Database of Xi Jinping's Economic Thought</div>
        </div>
        <div class="mainArea">
            <div class="content">
                <div class="welcome">欢迎登录</div>
                <div class="loginMethod">
                    <div class="method methodActive">账号密码登录</div>
                    <!-- <div class="line">｜</div> -->
                    <!-- <div class="method">验证码登录</div> -->
                </div>
                <div class="accountPswd">
                    <el-form :model="state.form" :rules="rules" ref="formRef">
                        <el-form-item prop="account">
                            <el-input
                                type="text"
                                placeholder="请输入账号"
                                v-model="state.form.account"
                            />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                placeholder="请输入密码"
                                v-model="state.form.password"
                                show-password
                            >
                            </el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="forgetPswd">
                    <!-- 忘记密码? -->
                </div>
                <div class="loginbtn" @click="loginOper">
                    登录
                </div>
                <div class="register">
                    <!-- <div class="left">没有账户？</div>
                    <div class="right">立即注册</div> -->
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import JSEncrypt from 'jsencrypt';
import { onMounted, reactive,ref } from 'vue'
import { useRouter } from 'vue-router'
import { userLogin } from '../api/index.js'
import { ElMessage } from 'element-plus'
const router = useRouter()
const formRef = ref(null)
const state = reactive({
    form:{
        account:'',//账户
        password:'',//密码
    }
})
const rules = {
    account:[
        {
            required:true,
            trigger:'blur',
            message:'请输入账号'
        }
    ],
    password:[
        {
            required:true,
            trigger:'blur',
            message:'请输入密码'
        }
    ],
}
onMounted(()=>{
    state.form = {
        account:'',//账户
        password:'',//密码
    }
})
//加密
const encryptPassword = (password) => {
    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(`MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCKsaD3y0P1nMnTcoYjausygrOY/Q1GWeSC1bgsggDqcxZs0aRZLhnUBg5ScqOBHIDzxxk2WUPUAWj7zIfmleHak6v3SWeDCRpdu43c1C2BMRtyfN8QPBkiwgs38OHGw2ME4FcbmWyZhESJGRmokWmLSWnQEJ9beX2sZU3VZ4KmawIDAQAB`); // 替换为你的公钥内容
    const encrypted = encryptor.encrypt(password); // 加密密码
    return encrypted; // 返回加密后的字符串
}
//登录
const loginOper = () => {
    if (!formRef) return
    formRef.value.validate((valid) => {
        if (!valid) {
            return
        }
        let param = {
            account: state.form.account,
            password:encryptPassword(state.form.password)
        }
        userLogin(param).then(res => {
            if(res.code == 0){
                localStorage.setItem('pro_userInfo',res.data.userName)
                router.push({
                    path:'/homeView',
                    query:{}
                })
                state.form = {
                    account:'',//账户
                    password:'',//密码
                }
            }
        })
    })
}
</script>
<style lang="scss" scoped>
.loginPage{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.titleArea{
    height: 240px;
    width: 100%;
    background-color: #ffffdf;
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
.mainArea{
    height: calc(100% - 240px);
    width: 100%;
    background-color: #fff;
    padding: 50px 0;
    display: flex;
    justify-content: center;
    .content{
        width: 400px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .welcome{
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 24px;
        font-weight: 700;
        color: #333;
        margin-bottom: 20px;
    }
    .loginMethod{
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666666;
        margin-bottom: 15px;
        .methodActive{
            color: #DD0003;
        }
    }
    .forgetPswd{
        width: 100%;
        display: flex;
        justify-content: flex-end;
        color: #DD0003;
        margin-bottom: 30px;
        font-size: 12px;
    }
    .loginbtn{
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #DD0003;
        color: #fff;
        font-size: 16px;
        margin-bottom: 15px;
    }
    .register{
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        .left{
            color: #233333;
        }
        .right{
            color: #DD0003;
        }
    }
}
:deep(.el-input){
    border: none;
}
:deep(.el-input__inner){
    height: 40px;
    width: 100%;
    border: none;
    background-color: transparent;
    padding: 5px 10px;
}
:deep(.el-input__wrapper){
    background-color: #f2f3f5;
}

:deep(.el-input){
    --el-input-hover-border: transparent;
    --el-input-focus-border: transparent;
    --el-input-focus-border-color: transparent;
}
</style>