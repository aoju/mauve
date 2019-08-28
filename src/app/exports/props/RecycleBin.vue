<template>
    <a-tabs :animated="false" defaultActiveKey="1" tabPosition="left" v-model="tabKey">
        <a-tab-pane key="1">
            <span slot="tab">
                <a-icon type="check-square"/>
                任务
            </span>
        </a-tab-pane>
        <a-tab-pane key="2">
            <span slot="tab">
                <a-icon type="link"/>
                文件
            </span>
        </a-tab-pane>
        <div class="config-content">
            <vue-scroll>
                <div class="content-item">
                    <div class="infos">
                        <a-list>
                            <div :style="{ textAlign: 'center', marginTop: '12px', height: '32px', lineHeight: '32px' }"
                                 slot="loadMore"
                                 v-if="showLoadingMore">
                                <a-spin v-if="loadingMore"/>
                                <a-button @click="onLoadMore" v-else>加载更多</a-button>
                            </div>
                            <a-list-item :key="index" v-for="(item, index) in list">
                                <a-list-item-meta>
                                    <div slot="title">
                                        <router-link :to="`/project/space/task/${code}/detail/${item.code}`"
                                                     class="text-default"
                                                     v-show="tabKey == '1'">
                                            {{ item.name }}
                                        </router-link>
                                        <a :href="item.file_url" class="text-default" target="_blank"
                                           v-show="tabKey == '2'">
                                            {{ item.fullName }}
                                        </a>
                                    </div>
                                    <div slot="description">
                                        {{showTaskTime(item.deleted_time)}}
                                    </div>
                                </a-list-item-meta>
                                <a @click="recoveryTask(item,index)" class="muted" slot="actions">
                                    <a-tooltip title="恢复内容">
                                        <a-icon type="undo"/>
                                    </a-tooltip>
                                </a>
                                <a @click="deleteItem(item,index)" class="muted" slot="actions">
                                    <a-tooltip title="彻底删除">
                                        <a-icon type="delete"/>
                                    </a-tooltip>
                                </a>
                            </a-list-item>
                        </a-list>
                    </div>
                </div>
            </vue-scroll>
        </div>
    </a-tabs>
</template>

<script>
    import {checkResponse} from '../../../assets/js/utils';
    import {del, list, recovery} from '../../feature/restapi/task';
    import {del as delFile, list as getFiles, recovery as recoveryFile} from '../../feature/restapi/file';
    import pagination from '../../shared/pagination';
    import {relativelyTaskTime} from '../../../assets/js/dateTime';

    export default {
        'name': 'recycleBin',
        'props': {
            'code': {
                'type': [String],
                default() {
                    return '';
                }
            }
        },
        'mixins': [pagination],
        data() {
            return {
                'loading': false,
                'tabKey': '1',
                'project': {},
                'list': [],
                'showLoadingMore': false,
                'loadingMore': false
            };
        },
        'watch': {
            code() {
                this.init();
            },
            tabKey(val) {
                this.init();
            }

        },
        created() {
            this.init();
        },
        'methods': {
            init(reset = true) {
                let app = this;
                if (reset) {
                    this.list = [];
                    this.pagination.page = 1;
                    this.pagination.pageSize = 10;
                    this.showLoadingMore = false;
                }
                this.requestData.deleted = 1;
                this.requestData.projectCode = this.code;
                app.loading = true;
                switch (this.tabKey) {
                    case '1':
                        app.getTasks();
                        break;
                    case '2':
                        app.getFiles();
                        break;
                }
            },
            getTasks() {
                let app = this;
                list(app.requestData).then(res => {
                    app.list = app.list.concat(res.data.list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.list.length;
                    app.loading = false;
                    app.loadingMore = false;
                });
            },
            getFiles() {
                let app = this;
                getFiles(app.requestData).then(res => {
                    app.list = app.list.concat(res.data.list);
                    app.pagination.total = res.data.total;
                    app.showLoadingMore = app.pagination.total > app.list.length;
                    app.loading = false;
                    app.loadingMore = false;
                });
            },
            onLoadMore() {
                this.loadingMore = true;
                this.pagination.page++;
                this.init(false);
            },
            showTaskTime(time) {
                return relativelyTaskTime(time);
            },
            recoveryTask(item, index) {
                let app = this;
                switch (this.tabKey) {
                    case '1':
                        this.$confirm({
                            'title': '确定恢复内容？',
                            'content': '恢复后可在任务列表中查看',
                            'okText': '恢复内容',
                            'okType': 'primary',
                            'cancelText': '再想想',
                            onOk() {
                                recovery(item.code).then((res) => {
                                    if (!checkResponse(res)) {
                                        return;
                                    }
                                    app.list.splice(index, 1);
                                    app.$emit('update', item);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case '2':
                        this.$confirm({
                            'title': '确定恢复文件？',
                            'content': '恢复后可在我的文件中查看',
                            'okText': '恢复文件',
                            'okType': 'primary',
                            'cancelText': '再想想',
                            onOk() {
                                recoveryFile(item.code).then((res) => {
                                    if (!checkResponse(res)) {
                                        return;
                                    }
                                    app.list.splice(index, 1);
                                    app.$emit('update', item);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                }
            },
            deleteItem(item, index) {
                let app = this;
                switch (this.tabKey) {
                    case '1':
                        this.$confirm({
                            'title': '确定彻底删除任务？',
                            'content': '彻底删除任务后，该任务及其子任务将会被永久被删除。',
                            'okText': '彻底删除',
                            'okType': 'danger',
                            'cancelText': '再想想',
                            onOk() {
                                del(item.code).then((res) => {
                                    if (!checkResponse(res)) {
                                        return;
                                    }
                                    app.list.splice(index, 1);
                                    app.$emit('update', item);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                    case '2':
                        this.$confirm({
                            'title': '确认彻底删除该文件？',
                            'content': '彻底删除文件后，相关的关联资源将会失效。',
                            'okText': '彻底删除',
                            'okType': 'danger',
                            'cancelText': '再想想',
                            onOk() {
                                delFile(item.code).then((res) => {
                                    if (!checkResponse(res)) {
                                        return;
                                    }
                                    app.list.splice(index, 1);
                                    app.$emit('update', item);
                                });
                                return Promise.resolve();
                            }
                        });
                        break;
                }
            }
        }
    };
</script>

<style lang="less">
    .recycle-bin-modal {
        .ant-modal-body {
            padding: 0;
        }

        .ant-modal-body {
            padding-bottom: 18px;

        }

        .ant-modal-body, .ant-tabs, .ant-tabs-bar {
            height: 84vh;
            min-width: 180px;

            .ant-tabs-tab {
                padding: 12px 24px;
                font-size: 16px;
            }
        }

        .ant-tabs-nav-wrap {
            padding-top: 10px;
        }

        .ant-tabs-left-content {
            padding-top: 6px;
            padding-right: 12px;
        }

        .ant-tabs .ant-tabs-left-bar .ant-tabs-tab {
            text-align: left;
        }

        .config-content {
            height: 80vh;

            .content-item {
                display: flex;
                justify-content: space-between;
                flex: 1 1;
                margin-bottom: 24px;

                .infos {
                    width: 100%;
                    padding-right: 12px;

                    p {
                        margin-bottom: 6px;
                    }

                    .item-title {
                        font-size: 16px;
                    }

                    .item-tips {
                        margin-bottom: 12px;
                    }
                }
            }
        }
    }
</style>
