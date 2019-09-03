import Vue from 'vue';
import VueRouter from 'vue-router';
import Antd, {message, notification} from 'ant-design-vue';
import VueClipboards from 'vue-clipboards';
import uploader from 'vue-simple-uploader';
import vuescroll from 'vuescroll';
import moment from 'moment';

import 'ant-design-vue/dist/antd.css';
import 'vuescroll/dist/vuescroll.css';
import 'moment/locale/zh-cn';
import './assets/css/theme.less';
import './assets/icon/iconfont';
import './app/shared/filter';
import {destroyNotice, notice} from './assets/js/notify';
import App from './app';
import store from './app/feature/stores/index';
import router from './app/feature/router/index';
import Wrapper from './app/frames/wrapper';
import common from './app/shared/common';

moment.locale('zh-cn');

Vue.use(VueRouter);
Vue.use(store);

Vue.config.productionTip = false;
Vue.use(Antd);
Vue.component('Wrapper', Wrapper);

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
