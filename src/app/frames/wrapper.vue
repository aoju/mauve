<template>
    <div>
        <div class="page-header" v-if="showHeader">
            <div class="breadcrumb" v-if="breadCrumbInfo.length > 0 && breadCrumb">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <router-link to="/home">首页</router-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>{{breadCrumbInfo[2].title}}</a-breadcrumb-item>
                    <a-breadcrumb-item>{{breadCrumbInfo[1].title}}</a-breadcrumb-item>
                    <a-breadcrumb-item>{{breadCrumbInfo[0].title}}</a-breadcrumb-item>
                    <!--<router-link :to="breadCrumbInfo[0].path">{{breadCrumbInfo[0].title}}</router-link>-->
                </a-breadcrumb>
            </div>
            <div class="detail">
                <div class="main">
                    <div class="row">
                        <h1 class="title" v-if="pageTitle.trim() != '' && showTitle">{{ pageTitle }}</h1>
                        <h1 class="title" v-else-if="showTitle">{{ defaultPageTitle }}</h1>
                        <div class="action">
                            <slot name="action"></slot>
                        </div>
                    </div>
                    <div class="row">
                        <div class="content" v-if="this.$slots.content">
                            <slot name="content"></slot>
                        </div>
                        <div class="extra" v-if="this.$slots.extra">
                            <slot name="extra"></slot>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="page-header page-header-none" v-else></div>
        <div class="page-header page-header-none"></div>

        <div class="wrapper-main">
            <div :class="{ 'hidden':pageLoading}"
                 class="wrapper-content">
                <div class="layout-content">
                    <div class="content-title" v-if="this.$slots.contentTitle || this.$slots.contentAction">
                        <slot name="contentTitle"></slot>
                        <div class="content-action">
                            <slot name="contentAction"></slot>
                        </div>
                    </div>
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
    import {mapState} from 'vuex';
    import $ from 'jquery';
    import ABreadcrumb from 'ant-design-vue/es/breadcrumb';
    import {getStore} from '../shared/storage';
    import {getClassObj} from '../shared/utils';

    const ABreadcrumbItem = ABreadcrumb.Item;

    export default {
        'components': {
            ABreadcrumb,
            ABreadcrumbItem
        },
        'props': {
            'pageTitle': {
                'default': ''
            },
            'showTitle': {
                'default': true
            },
            'showHeader': {
                'default': true
            },
            'breadCrumb': {
                'default': true
            }
        },
        mounted() {
            function TraversalObject(obj, value) {
                for (let a in obj) {
                    if (typeof (obj[a]) === 'object') {
                        TraversalObject(obj[a], value);
                    } else {
                        if (a === 'name' && obj[a] === value) {
                            window.permission = true;
                        }
                    }
                }
            }

            const auth_list = getStore('auth_list', true);
            const permissions = $('a[permission]');
            if (permissions) {
                $.each(permissions, function (k, v) {
                    let permission = $(v).attr('permission');
                    window.permission = false;
                    TraversalObject(auth_list, permission);
                    if (!window.permission) {
                        $(v).remove();
                    }
                });
            }
            this.$nextTick(function () {
                const ClassElements = getClassObj('wrapper-main');
                if (ClassElements.length > 1) {
                    for (let i = 0; i < ClassElements.length - 1; i++) {
                        ClassElements[i].style.display = 'none';
                    }
                }
            });
        },
        'computed': {
            ...mapState({
                'pageLoading': state => state.pageLoading,
                'breadCrumbInfo': state => state.menu.breadCrumbInfo
            }),
            'defaultPageTitle': {
                get() {
                    return this.$route.meta.info.title;
                }
            },
            'wrapper_content_class': function () {
            }
        },
        'destroyed': function () {
            this.$nextTick(function () {
                const ClassElements = getClassObj('wrapper-main');
                for (let i = 0; i < ClassElements.length; i++) {
                    ClassElements[i].removeAttribute('style');
                }
            });
        }
    };
</script>
