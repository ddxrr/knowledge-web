import SvgIcon from '@/components/SvgIcon'
import Dialog from '@/components/Dialog'
import CustomBtn from '@/components/CustomBtn'
import TDesginDialog from '@/components/TDesginDialog'
import TDUpload from '@/components/TDUpload'
import elUpload from '@/components/ELUpload'
import Camera from '@/components/Camera'
import rightDrawer from '@/components/rightDrawer'
import WordEditor from '@/components/WordEditor'
import lookPdf from '@/components/LookFile/pdf_preview'
import lookPdfjsDist from '@/components/LookFile/pdfjsDist_preview'
import lookWord from '@/components/LookFile/word_preview'
import markdown from '@/components/LookFile/markdown/index.vue'
import dragUpload from '@/components/ELUpload/dragUpload.vue'
// import docx_Component from '@/components/FileLook/docx.vue'
// import excel_Component from '@/components/FileLook/excel.vue'
// import pdf_Component from '@/components/FileLook/pdf.vue'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import Menus from 'vue3-menus'
// console.log('🚀 ~ Menus:', Menus)
import { directive, menusEvent, Vue3Menus } from 'vue3-menus'

export default {
  install(app) {
    app.component('svg-icon', SvgIcon)
    app.component('my-dialog', Dialog)
    app.component('my-td-dialog', TDesginDialog)
    app.component('my-td-upload', TDUpload)
    app.component('my-el-upload', elUpload)
    app.component('my-camera', Camera)
    app.component('my-right-drawer', rightDrawer)
    app.component('my-editor', WordEditor)
    app.component('my-lookPdf', lookPdf)
    app.component('my-lookPdfjs-dist', lookPdfjsDist)
    app.component('my-lookWord', lookWord)
    app.component('my-markdown', markdown)
    app.component('my-button', CustomBtn)
    app.component('my-dragUpload', dragUpload)
    // 文件查看
    // app.component('my-docx', docx_Component)
    // app.component('my-excel', excel_Component)
    // app.component('my-pdf', pdf_Component)

    // app.use(Menus)
    app.component('vue3-menus', Vue3Menus) // 只注册组件
    app.directive('menus', directive) // 只注册指令
    app.config.globalProperties.$menusEvent = menusEvent // 只绑定方法

    // for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    //   app.component(key, component)
    // }
  }
}
