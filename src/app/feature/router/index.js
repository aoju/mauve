import Vue from 'vue';
import store from '../../feature/stores';
import Router from 'vue-router';
import Index from '../../frames/index';
import Home from './home';
import {getStore, setStore} from '../../shared/storage';
import {createRoute, isTokenExpired} from '../../shared/utils';
import config from '../config/config';
import {refreshAccessToken} from '../restapi/api.index';

Vue.use(Router);
const routes = [].concat(
    Home
);

const menu = getStore('menu', true);
if (menu) {
    menu.forEach(function (v) {
        routes.push(createRoute(v));
        if (v.children) {
            v.children.forEach(function (v2) {
                routes.push(createRoute(v2));
                if (v2.children) {
                    v2.children.forEach(function (v3) {
                        routes.push(createRoute(v3));
                    });
                }
            });
        }
    });
}
const router = new Router({
    'mode': 'history',
    'routes': [
        {
            'path': '/',
            'name': 'index',
            'component': Index,
            'children': routes
        }, {
            'name': 'member',
            'path': '/member',
            'component': resolve => require(['@/app/frames/home/index'], resolve),
            'meta': {'model': 'Login'},
            'children': [
                {
                    'path': 'login',
                    'name': 'login',
                    'component': () => import( '../../widget/member/login'),
                    'meta': {'model': 'Login'}
                },
                {
                    'path': 'register',
                    'name': 'register',
                    'component': () => import('../../widget/member/Register'),
                    'meta': {'model': 'Login'}
                },
                {
                    'path': 'forgot',
                    'name': 'forgot',
                    'component': () => import('../../widget/member/forgot'),
                    'meta': {'model': 'Login'}
                }
            ]
        },
        {
            'name': 'install',
            'path': '/install',
            'component': resolve => require(['../../widget/errors/install'], resolve),
            'meta': {'model': 'error'}
        },
        {
            'name': 'resetEmail',
            'path': '/reset/email',
            'component': resolve => require(['../../widget/member/email'], resolve),
            'meta': {'model': 'error'}
        },
        {
            'name': '404',
            'path': '/404',
            'component': resolve => require(['../../widget/errors/404'], resolve),
            'meta': {'model': 'error'}
        },
        {
            'name': '403',
            'path': '/403',
            'component': resolve => require(['../../widget/errors/403'], resolve),
            'meta': {'model': 'error'}
        },
        {
            'name': '500',
            'path': '/500',
            'component': resolve => require(['../../widget/errors/500'], resolve),
            'meta': {'model': 'error'}
        }
    ]
});

router.beforeEach((to, from, next) => {
    let tokenList = getStore('tokenList', true);
    if (tokenList) {
        let refreshToken = tokenList.refreshToken;
        let accessTokenExp = tokenList.accessTokenExp;
        //判断accessToken即将到期后刷新token
        if (accessTokenExp && isTokenExpired(accessTokenExp)) {
            refreshAccessToken(refreshToken).then(res => {
                tokenList.accessToken = res.data.accessToken;
                tokenList.accessTokenExp = res.data.accessTokenExp;
                setStore('tokenList', tokenList);
            });
        }
    }
    const HOME_PAGE = config.HOME_PAGE;
    //页面中转
    if (to.name === 'index' || to.path === '/index' || to.path === '/') {
        next({'path': HOME_PAGE});
        return false;
    }
    //无效页面跳转至首页
    if (!to.name && from.meta.model !== 'Login' && to.path !== HOME_PAGE) {
        next({'path': '/404'});
        return false;
    }
    if (to.meta.model === 'Login' && store.state.logged) {
        next({'path': HOME_PAGE});
        return false;
    }
    if (!store.state.logged && to.meta.model !== 'Login' && to.meta.model !== 'error') {
        next({
            'name': 'login',
            'query': {'redirect': to.fullPath}
        });
        return false;
    }
    next();
});
router.afterEach(route => {
    //预留
    // window.scrollTo(0,0)
});

export default router;
