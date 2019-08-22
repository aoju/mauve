import Vue from 'vue';
import VueRouter from 'vue-router';
import Antd, {message, notification} from 'ant-design-vue';
import App from './App';
import store from './app/frames/stores/index';
import router from './app/frames/router/index';
import 'ant-design-vue/dist/antd.css';
import vuescroll from 'vuescroll';
import 'vuescroll/dist/vuescroll.css';
import '@/assets/css/theme.less';
import '@/assets/icon/iconfont';
import WrapperContent from '@/app/exports/layout/WrapperContent';
import {destroyNotice, notice} from './assets/js/notice';

import moment from 'moment';
import 'moment/locale/zh-cn';

import common from './app/shared/common';

import '@/app/shared/filter'; // global filter
import VueClipboards from 'vue-clipboards';
import uploader from 'vue-simple-uploader';


moment.locale('zh-cn');

Vue.use(VueRouter);
Vue.use(store);

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.component('WrapperContent', WrapperContent);

Vue.use(VueClipboards);

Vue.use(uploader);

Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
Vue.prototype.$notice = notice;
Vue.prototype.$destroyNotice = destroyNotice;

Vue.use(vuescroll);
Vue.prototype.$vuescrollConfig = {
    'vuescroll': {
        'mode': 'native'
    },
    'scrollPanel': {
        'scrollingX': true
    },
    'bar': {
        'delayTime': 500,
        'onlyShowBarOnScroll': false,
        'background': '#cecece',
        'keepShow': false
    }
};

Vue.mixin(common);


new Vue({
    'el': '#app',
    store,
    router,
    'template': '<App/>',
    'components': {App}
});
