<template>
    <div class="home-index">
        <div class="page-header">
            <p class="day-text muted">『 {{ yiyan.hitokoto }}』 —— 《{{ yiyan.from }}》 <a @click="getYiYan" class="muted">
                <a-icon type="reload"/>
            </a>
            </p>
            <div class="header-content">
                <div class="left-content">
                    <div class="avatar">
                        <a-avatar :size="64" :src="userInfo.avatar">{{userInfo.name}}</a-avatar>
                    </div>
                    <div class="user-info">
                        <div class="title">{{helloTime}}{{ userInfo.name }}，祝你开心每一天！</div>
                        <div class="team muted" v-if="userInfo.position">{{userInfo.position}}
                            <template v-if="userInfo.department"> | {{ userInfo.department }}</template>
                        </div>
                    </div>
                </div>
                <div class="right-content">
                    <div class="content-item">
                        <div class="item-title muted">
                            任务数
                        </div>
                        <div class="item-text">
                            <span>{{tasksTotal}}</span>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="item-title muted">
                            团队内排名
                        </div>
                        <div class="item-text">
                            <span>2 <span class="small muted">/ 8</span> </span>
                        </div>
                    </div>
                    <div class="content-item">
                        <div class="item-title muted">
                            项目总数
                        </div>
                        <div class="item-text">
                            <span>{{projectTotal}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--<wrapper-content :showHeader="false">-->
        <div class="page-wrapper">
            <a-row :gutter="24">
                <a-col :lg="24" :md="24" :sm="24" :xl="16" :xs="24">
                    <a-card
                            :body-style="{ padding: 0 }"
                            :bordered="false"
                            :loading="loading"
                            class="project-list"
                            style="margin-bottom: 24px;"
                            title="进行中的项目">
                        <router-link slot="extra" to="/project/index/my">全部项目</router-link>
                        <div>
                            <a-card-grid :key="i" class="project-card-grid" v-for="(item, i) in projectList">
                                <a-card :body-style="{ padding: 0 }" :bordered="false"
                                        @click="routerLink('/project/space/task/' + item.code)">
                                    <a-card-meta>
                                        <div class="card-title" slot="title">
                                            <a-avatar :src="item.cover" size="small"/>
                                            <router-link :to="'/project/space/task/' + item.code">{{ item.name }}
                                            </router-link>
                                        </div>
                                        <div class="card-description" slot="description">
                                            <a-tooltip :mouseEnterDelay="0.3"
                                                       :title="item.description">
                                            <span class="description-text">
                                                <span v-if="item.description">{{ item.description }}</span>
                                                <span v-else>暂无介绍</span>
                                            </span>
                                            </a-tooltip>
                                            <a-tooltip :mouseEnterDelay="0.3" :title="`当前进度：${item.schedule}%`"
                                                       placement="right">
                                                <a-progress :percent="item.schedule" :showInfo="false"
                                                            :strokeWidth="2"/>
                                            </a-tooltip>
                                        </div>
                                    </a-card-meta>
                                    <div class="project-item">
                                        <a href="/#/">{{ item.owner_name }}</a>
                                        <span class="datetime">{{ formatTime(item.create_time) }}</span>
                                    </div>
                                </a-card>
                            </a-card-grid>
                            <p class="muted text-center m-t-md m-b-md" v-if="!projectList.length">暂无项目</p>
                        </div>
                    </a-card>
                    <a-card :bordered="false" :loading="loading" class="activities-list" title="动态">
                        <a-list>
                            <a-list-item :key="index" v-for="(item, index) in activities">
                                <a-list-item-meta>
                                    <a-avatar :src="item.member_avatar" slot="avatar"/>
                                    <div slot="title">
                                        <span>{{ item.member_name }}</span>
                                        <span v-if="item.is_comment == 0">  <span v-html="item.remark "></span></span>&nbsp;
                                        <template v-if="item.is_comment == 1">发表了评论
                                            <p class="comment-text">{{ item.content }}</p>
                                        </template>
                                        <router-link :to="`/project/space/task/${item.project_code}/detail/${item.source_code}`"
                                                     class="right-item"
                                                     target="_blank">「 {{ item.task_name }} 」
                                        </router-link>
                                    </div>
                                    <div slot="description">
                                        <!--<a-tooltip :mouseEnterDelay="0.3" :title="item.create_time">-->
                                        {{ formatTime(item.create_time) }} -
                                        <router-link :to="`/project/space/task/${item.project_code}`" class="muted"
                                                     target="_blank">
                                            {{item.project_name}}
                                        </router-link>
                                        <!--</a-tooltip>-->
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-card>
                </a-col>
                <a-col
                        :lg="24"
                        :md="24"
                        :sm="24"
                        :xl="8"
                        :xs="24"
                        style="padding: 0 12px">
                    <a-card :bordered="false" :loading="loading" :title="`我的任务 · ${tasks.length}`"
                            class="tasks-list"
                            style="margin-bottom: 24px">
                        <a-list>
                            <a-list-item :key="index" v-for="(item, index) in tasks">
                                <a-list-item-meta>
                                    <div slot="title">
                                        <router-link :to="`/project/space/task/${item.projectInfo.code}/detail/${item.code}`"
                                                     target="_blank">
                                            {{ item.name }}
                                        </router-link>
                                    </div>
                                    <div slot="description">
                                        <span :class="showTimeLabel(item.end_time)" class="label m-r-xs"
                                              v-if="item.end_time">{{showTaskTime(item.begin_time, item.end_time)}}</span>
                                        <router-link :to="'/project/space/task/' + item.projectInfo.code" class="muted"
                                                     target="_blank">{{
                                            item.projectInfo.name }}
                                        </router-link>
                                    </div>
                                </a-list-item-meta>
                            </a-list-item>
                        </a-list>
                    </a-card>
                    <!-- <a-col
                             style="padding: 0 12px"
                             :xl="8"
                             :lg="24"
                             :md="24"
                             :sm="24"
                             :xs="24">
                         <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false"
                                 :body-style="{padding: 0}">
                             <div class="item-group">
                                 <a>操作一</a>
                                 <a>操作二</a>
                                 <a>操作三</a>
                                 <a>操作四</a>
                                 <a>操作五</a>
                                 <a>操作六</a>
                                 <a-button size="small" type="primary" ghost icon="plus">添加</a-button>
                             </div>
                         </a-card>-->
                    <!--    <a-card title="XX 指数" style="margin-bottom: 24px" :loading="radarLoading" :bordered="false" :body-style="{ padding: 0 }">
                            <div style="min-height: 400px;">
                                &lt;!&ndash; :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  &ndash;&gt;
                                <radar :data="radarData" />
                            </div>
                        </a-card>-->
                    <a-card :bordered="false" :loading="loading" title="团队">
                        <div class="members">
                            <a-row>
                                <a-col :key="index" :span="12" v-for="(item, index) in accounts">
                                    <a>
                                        <a-avatar :src="item.avatar" size="small"/>
                                        <span class="member">{{ item.name }}</span>
                                    </a>
                                </a-col>
                            </a-row>
                        </div>
                    </a-card>
                </a-col>
            </a-row>
        </div>
        <!--</wrapper-content>-->
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import moment from 'moment';
    import {getYiYan} from '../../feature/restapi/other';
    import {formatTaskTime, relativelyTime, showHelloTime} from '../../../assets/js/dateTime';
    import {selfList as getProjectList} from '../../feature/restapi/project';
    import {list as accountList} from '../../feature/restapi/user';
    import pagination from '../../shared/pagination';
    import {getLogBySelfProject, selfList} from '../../feature/restapi/task';

    export default {
        'components': {},
        'mixins': [pagination],
        data() {
            return {
                'loading': false,
                'yiyan': {},
                'projectList': [],
                'projectTotal': 0,
                'activities': [],
                'tasks': [],
                'tasksTotal': 0,
                'accounts': []
            };
        },
        'computed': {
            ...mapState({
                'userInfo': state => state.userInfo,
                'socketAction': state => state.socketAction
            }),
            helloTime() {
                return showHelloTime();
            }
        },
        created() {
            this.getYiYan();
            this.init();
        },
        'watch': {
            socketAction(val) {
                if (val.action === 'organization:task') {
                    this.init(false, false);
                }
            }
        },
        'methods': {
            init(reset = true, loading = true) {
                if (reset) {
                    this.projectList = [];
                    this.pagination.page = 1;
                    this.pagination.pageSize = 9;
                }
                this.getProjectList(loading);
                this.getTasks();
                this.getTaskLog();
                this.getAccountList();
            },
            getProjectList(loading) {
                if (loading) {
                    this.loading = true;
                }
                getProjectList(this.requestData).then(res => {
                    this.projectList = res.data.list;
                    this.projectTotal = res.data.total;
                    this.loading = false;
                });
            },
            getTasks() {
                selfList({'page': 1, 'pageSize': 10}).then(res => {
                    this.tasks = res.data.list;
                    this.tasksTotal = res.data.total;
                });
            },
            getTaskLog() {
                getLogBySelfProject().then(res => {
                    this.activities = res.data;
                });
            },
            getAccountList() {
                accountList().then(res => {
                    this.accounts = res.data.list;
                });
            },
            getYiYan() {
                let app = this;
                getYiYan(function (data) {
                    app.yiyan = data;
                }, 'd');
            },
            formatTime(time) {
                return relativelyTime(time);
            },
            showTaskTime(time, timeEnd) {
                return formatTaskTime(time, timeEnd);
            },
            showTimeLabel(time) {
                let str = 'label-primary';
                if (time === null) {
                    return str;
                }
                let cha = moment(moment(time).format('YYYY-MM-DD')).diff(moment().format('YYYY-MM-DD'), 'days');
                if (cha < 0) {
                    str = 'label-danger';
                } else if (cha === 0) {
                    str = 'label-warning';
                } else if (cha > 7) {
                    str = 'label-normal';
                }
                return str;
            }
        }
    };
</script>
<style lang="less">
    .home-index {
        .page-header {
            .header-content {
                margin-bottom: 16px;
                display: flex;
                justify-content: space-between;

                .left-content {
                    display: flex;
                    align-items: center;

                    .user-info {
                        margin-left: 12px;
                        line-height: 33px;

                        .title {
                            font-size: 20px;
                        }

                        .team {

                        }
                    }
                }

                .right-content {
                    display: flex;

                    .content-item {
                        padding: 0 32px;
                        position: relative;

                        .item-text {
                            font-size: 30px;

                            .small {
                                font-size: 20px;
                            }
                        }

                        &:after {
                            background-color: #e8e8e8;
                            position: absolute;
                            top: 8px;
                            right: 0;
                            width: 1px;
                            height: 40px;
                            content: "";
                        }

                        &:last-child {
                            &:after {
                                width: 0;
                            }
                        }
                    }
                }
            }
        }

        .page-wrapper {
            margin: 24px;

            .project-list {

                .card-title {
                    font-size: 0;

                    a {
                        color: rgba(0, 0, 0, 0.85);
                        margin-left: 12px;
                        line-height: 24px;
                        height: 24px;
                        display: inline-block;
                        vertical-align: top;
                        font-size: 14px;

                        &:hover {
                            color: #1890ff;
                        }
                    }
                }

                .card-description {
                    color: rgba(0, 0, 0, 0.45);
                    height: 44px;
                    line-height: 22px;
                    overflow: hidden;

                    .description-text {
                        height: 22px;
                    }
                }

                .project-item {
                    display: flex;
                    margin-top: 8px;
                    overflow: hidden;
                    font-size: 12px;
                    height: 20px;
                    line-height: 20px;

                    a {
                        color: rgba(0, 0, 0, 0.45);
                        display: inline-block;
                        flex: 1 1 0;

                        &:hover {
                            color: #1890ff;
                        }
                    }

                    .datetime {
                        color: rgba(0, 0, 0, 0.25);
                        flex: 0 0 auto;
                        float: right;
                    }
                }

                .ant-card-meta-description {
                    color: rgba(0, 0, 0, 0.45);
                    height: 44px;
                    line-height: 22px;
                    overflow: hidden;
                }
            }

            .activities-list {
                .ant-list-item-meta-title {
                    position: relative;
                }

                .comment-text {
                    margin-bottom: 0;
                }

                .right-item {
                    float: right;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
            }

            .tasks-list {
                .ant-card-body {
                    padding: 6px 24px;
                }
            }

            .item-group {
                padding: 20px 0 8px 24px;
                font-size: 0;

                a {
                    color: rgba(0, 0, 0, 0.65);
                    display: inline-block;
                    font-size: 14px;
                    margin-bottom: 13px;
                    width: 25%;
                }
            }

            .members {
                a {
                    display: block;
                    margin: 12px 0;
                    line-height: 24px;
                    height: 24px;

                    .member {
                        font-size: 14px;
                        color: rgba(0, 0, 0, .65);
                        line-height: 24px;
                        max-width: 100px;
                        vertical-align: top;
                        margin-left: 12px;
                        transition: all 0.3s;
                        display: inline-block;
                    }

                    &:hover {
                        span {
                            color: #1890ff;
                        }
                    }
                }
            }
        }
    }
</style>
