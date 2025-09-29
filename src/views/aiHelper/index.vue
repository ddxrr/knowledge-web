<template>
    <div class="aiHelperAll">
        <div class="mainContent">
            <Left />
            <Right />
        </div>
    </div>
</template>
<script setup>
import Left from './left.vue'
import Right from './right.vue'
</script>
<style lang="scss" scoped>
.aiHelperAll{
    width: 100%;
    height: 100%;
    background-color: #fff4ec;
    padding: 30px 40px;
    box-sizing: border-box;
    background-image: url('../../assets/img/aiBg.png');
    background-size: contain;
    background-repeat: no-repeat;
    .mainContent{
        width: 100%;
        height: 100%;
        display: flex;
    }
}
</style>