<template>
    <div :class="project.task_board_theme" class="project-space-features">
        <div class="project-navigation">
            <div class="project-nav-header">
                <a-breadcrumb>
                    <a-breadcrumb-item>
                        <router-link to="/home">
                            <a-icon type="home"/>
                            首页
                        </router-link>
                    </a-breadcrumb-item>
                    <a-breadcrumb-item>
                        <project-select class="nav-title" style="display: inline-block" :code="code"></project-select>
                        <span class="actions">
                             <a-tooltip :mouseEnterDelay="0.3" :title="project.collected ? '取消收藏' : '加入收藏'"
                                        @click="collectProject">
                            <a-icon type="star" theme="filled" style="color: grey;" v-show="!project.collected"/>
                            <a-icon type="star" theme="filled" style="color: #ffaf38;" v-show="project.collected"/>
                        </a-tooltip>
                        </span>
                        <span class="label label-normal" v-if="project.private === 0"><a-icon type="global"/> 公开</span>
                    </a-breadcrumb-item>
                </a-breadcrumb>
            </div>
            <section class="nav-body">
                <ul class="nav-wrapper nav nav-underscore pull-left">
                    <li><a @click="$router.push('/project/space/task/' + project.code)" class="app"
                           data-app="tasks">任务</a></li>
                    <li class=""><a @click="$router.push('/project/space/files/' + project.code)" class="app"
                                    data-app="works">
                        文件</a>
                    <li><a @click="$router.push('/project/space/overview/' + project.code)" class="app"
                           data-app="build">
                        概览</a>
                    </li>
                    <li class="actives"><a @click="$router.push('/project/space/features/' + project.code)" class="app"
                                           data-app="build">
                        版本</a>
                    </li>
                </ul>
            </section>
        </div>
        <wrapper :showHeader="false">
            <div class="content-wrapper">
                <div class="content-item features-content">
                    <div class="actions m-t">
                        <a-dropdown :trigger="['click']" placement="bottomCenter" v-if="currentProjectFeatures">
                            <a class="m-r text-default features-list-dropdown">
                                <span class="m-r-xs">{{currentProjectFeatures.name}}</span>
                                <a-icon type="down"/>
                            </a>
                            <a-menu :selectable="false" @click="changeProjectFeatures"
                                    class="field-right-menu"
                                    slot="overlay">
                                <a-menu-item :key="projectFeatures.code" v-for="projectFeatures in projectFeaturesList">
                                    <div class="menu-item-content">
                                        <div>
                                            <a-radio
                                                    :checked="currentProjectFeatures.code == projectFeatures.code"></a-radio>
                                            <span color="green">{{projectFeatures.name}}</span>
                                        </div>
                                        <div>
                                            <a class="muted">
                                                <a-icon @click.stop="editFeatures(projectFeatures)"
                                                        type="edit"></a-icon>
                                            </a>
                                            <a class="muted">
                                                <a-icon @click.stop="deleteFeatures(projectFeatures)" class="m-l"
                                                        type="delete"></a-icon>
                                            </a>
                                        </div>
                                    </div>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                        <a-button @click="createFeatures" icon="plus" type="primary">创建版本库</a-button>
                        <a-divider class="m-b-lg m-t-lg"></a-divider>
                    </div>
                    <a-spin :spinning="loading" v-if="currentProjectFeatures">
                        <template v-if="versionTotal">
                            <div :key="versionType" v-for="(versionItem,versionType) in versionList">
                                <a @click="showPublished = !showPublished" class="muted m-l-sm m-b-sm"
                                   style="cursor: pointer;display: block"
                                   v-if="versionType == 'published' && versionItem.length">
                                    <span class="m-r-sm">已发布版本</span>
                                    <a-icon type="up" v-show="showPublished"/>
                                    <a-icon type="ellipsis" v-show="!showPublished"/>
                                </a>
                                <div :class="{'published':versionType == 'published'}" class="version-content">
                                    <template v-for="(version,versionIndex) in versionItem">
                                        <a-card :key="versionIndex" @click="showVersionDetail(version.code)" class="version-item"
                                                hoverable
                                                v-show="versionType != 'published' || (versionType == 'published' && showPublished)">
                                            <template slot="title">
                                                <strong :class="{'muted':versionType == 'published'}">{{version.name}}</strong>
                                                <a-dropdown :trigger="['click']" placement="bottomCenter"
                                                            v-show="versionType == 'normal'">
                                             <span :class="`status-${version.status}`" @click.stop="()=>{}"
                                                   class="version-status">
                                                 <a-icon type="schedule"/> <span
                                                     class="m-l-xs">{{version.statusText}}</span>
                                            </span>
                                                    <a-menu :selectable="false" @click="changeVersionStatus($event,versionType,version,versionIndex)"
                                                            class="field-right-menu"
                                                            slot="overlay">
                                                        <a-menu-item key="0">
                                                            <div class="menu-item-content">
                                                                <a-tag>未开始</a-tag>
                                                                <a-icon class="check muted" type="check"
                                                                        v-show="version.status == 0"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="1">
                                                            <div class="menu-item-content">
                                                                <a-tag color="blue">进行中</a-tag>
                                                                <a-icon class="check muted" type="check"
                                                                        v-show="version.status == 1"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="2">
                                                            <div class="menu-item-content">
                                                                <a-tag color="red">延期发布</a-tag>
                                                                <a-icon class="check muted" type="check"
                                                                        v-show="version.status == 2"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                        <a-menu-item key="3">
                                                            <div class="menu-item-content">
                                                                <a-tag color="green">已发布</a-tag>
                                                                <a-icon class="check muted" type="check"
                                                                        v-show="version.status == 3"></a-icon>
                                                            </div>
                                                        </a-menu-item>
                                                    </a-menu>
                                                </a-dropdown>
                                            </template>
                                            <div class="publish-time muted">
                                                <template v-if="version.publish_time || version.plan_publish_time ">
                                                    <span v-if="versionType == 'normal'">预计发布时间：{{version.plan_publish_time}}</span>
                                                    <span v-else>发布时间：{{version.publish_time}}</span>
                                                </template>
                                            </div>
                                            <a-tooltip :mouseEnterDelay="0.3" :title="`当前进度：${version.schedule}%`"
                                                       placement="top"
                                                       v-show="versionType == 'normal'">
                                                <a-progress :percent="parseInt(version.schedule)" :showInfo="false"
                                                            :strokeWidth="4"/>
                                            </a-tooltip>
                                        </a-card>
                                    </template>
                                    <a-card @click="createVersion" class="version-item version-create"
                                            hoverable v-show="versionType == 'normal'">
                                        <a class="muted">
                                            <div>
                                                <a-icon type="plus"></a-icon>
                                                <div>创建版本</div>
                                            </div>
                                        </a>
                                    </a-card>
                                </div>
                            </div>
                        </template>
                        <div class="text-center" v-else>
                            <p class="muted">暂无可用版本</p>
                            <a-button @click="createVersion" type="primary">创建版本</a-button>
                        </div>
                    </a-spin>
                </div>
            </div>
        </wrapper>
        <a-modal
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
                :title="projectFeatures.modalTitle"
                :width="360"
                destroyOnClose
                v-model="projectFeatures.modalStatus"
        >
            <a-form
                    :form="form"
                    @submit.prevent="handleSubmit"
            >
                <a-form-item
                >
                    <a-input placeholder='版本库名称'
                             v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入版本库名称' }]}
                                            ]"/>
                </a-form-item>
                <a-form-item
                >
                    <a-textarea :rows="2"
                                placeholder='版本库简介'
                                v-decorator="['description']"
                    />
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn">
                        <a-button :loading="projectFeatures.confirmLoading" block
                                  class="middle-btn"
                                  htmlType='submit'
                                  size="large"
                                  type="primary">{{projectFeatures.modalTitle}}
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
                :title="projectVersion.modalTitle"
                :width="500"
                destroyOnClose
                v-model="projectVersion.modalStatus"
        >
            <a-form
                    :form="projectVersionForm"
                    @submit.prevent="handleSubmitProjectVersion"
            >
                <a-form-item
                >
                    <a-input placeholder='版本名称'
                             v-decorator="[
                                            'name',
                                            {rules: [{ required: true, message: '请输入版本名称' }]}
                                            ]"/>
                </a-form-item>
                <a-form-item
                >
                    <a-textarea :rows="2"
                                placeholder='版本备注'
                                v-decorator="['description']"
                    />
                </a-form-item>
                <a-form-item
                >
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-date-picker format="YYYY年MM月DD日 HH:mm" placeholder="选择开始时间" showTime
                                           style="width: 100%" v-decorator="['startTime']"></a-date-picker>
                        </a-col>
                        <a-col :span="12">
                            <a-date-picker format="YYYY年MM月DD日 HH:mm" placeholder="选择预计发布时间" showTime
                                           style="width: 100%" v-decorator="['planPublishTime']"></a-date-picker>
                        </a-col>
                    </a-row>
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn">
                        <a-button :loading="projectVersion.confirmLoading" block
                                  class="middle-btn"
                                  htmlType='submit'
                                  size="large"
                                  type="primary">创建版本
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
                :width="360"
                destroyOnClose
                title="实际发布时间"
                v-model="publishVersion.modalStatus"
        >
            <a-form
                    :form="publishVersionForm"
                    @submit.prevent="handleSubmitPublishVersion"
            >
                <a-form-item
                >
                    <a-date-picker format="YYYY年MM月DD日 HH:mm" placeholder="选择实际发布时间" showTime
                                   style="width: 100%" v-decorator="['publishTime']"></a-date-picker>
                </a-form-item>
                <a-form-item
                >
                    <div class="action-btn">
                        <a-button :loading="publishVersion.confirmLoading" block
                                  class="middle-btn"
                                  htmlType='submit'
                                  size="large"
                                  type="primary">确认发布
                        </a-button>
                    </div>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                :closable="false"
                :footer="null"
                @cancel="versionDetailClose"
                class="task-detail-modal"
                destroyOnClose
                title=""
                v-model="versionDetail.modalStatus"
                width="min-content"
        >
            <version-detail :versionCode="versionDetail.code" @close="versionDetailClose"></version-detail>

        </a-modal>
    </div>
</template>

<script>
    import moment from 'moment';
    import {read as getProject} from '../../../feature/restapi/api.project';
    import {collect} from '../../../feature/restapi/api.project.collect';
    import {checkResponse} from '../../../shared/utils';
    import {relativelyTime} from '../../../shared/dateTime';
    import pagination from '../../../shared/pagination';
    import {del, edit, list as getProjectFeatureList, save} from '../../../feature/restapi/api.project.feature';
    import {
        changeStatus,
        list as getProjectVersionList,
        save as saveProjectVersion
    } from '../../../feature/restapi/api.project.version';
    import versionDetail from '../../../exports/props/version.detail';
    import projectSelect from '../../../exports/props/project.select';

    export default {
        'name': 'project-space-features',
        'components': {
            versionDetail,
            projectSelect
        },
        'mixins': [pagination],
        data() {
            return {
                'code': this.$route.params.code,
                'project': {'task_board_theme': 'simple'},
                'loading': true,
                'form': this.$form.createForm(this),
                'projectVersionForm': this.$form.createForm(this),
                'publishVersionForm': this.$form.createForm(this),
                'projectFeaturesList': [],
                'currentProjectFeatures': null,
                'currentProjectVersion': null,
                'versionTotal': 1,
                'versionList': {
                    'normal': [],
                    'published': []
                },
                'showPublished': false,
                'projectFeatures': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'modalTitle': '编辑版本库',
                    'info': null
                },
                'projectVersion': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'modalTitle': '编辑版本',
                    'info': null
                },
                'publishVersion': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'info': null,
                    'status': -1
                },
                'versionDetail': {
                    'modalStatus': false,
                    'code': ''
                }
            };
        },
        created() {
            this.getProject();
            this.init();
        },
        'methods': {
            init() {
                this.getProjectFeaturesList();
            },
            getProject() {
                this.loading = true;
                getProject(this.code).then((res) => {
                    this.loading = false;
                    this.project = res.data;
                });
            },
            getProjectFeaturesList() {
                getProjectFeatureList({'projectCode': this.code}).then(res => {
                    this.projectFeaturesList = res.data;
                    if (res.data.length && !this.currentProjectFeature) {
                        this.currentProjectFeatures = res.data[0];
                        this.getProjectVersionList();
                    }
                });
            },
            getProjectVersionList() {
                let app = this;
                app.loading = true;
                getProjectVersionList({'projectFeaturesCode': this.currentProjectFeatures.code}).then(res => {
                    let versionTotal = 0;
                    let normal = [];
                    let published = [];
                    res.data.forEach(v => {
                        versionTotal++;
                        if (v.status === 3) {
                            published.push(v);
                        } else {
                            normal.push(v);
                        }
                    });
                    app.versionTotal = versionTotal;
                    app.versionList.normal = normal;
                    app.versionList.published = published;
                    app.loading = false;
                });
            },
            createFeatures() {
                let app = this;
                app.projectFeatures.modalStatus = true;
                app.projectFeatures.info = null;
                app.projectFeatures.modalTitle = '创建版本库';
            },
            editFeatures(features) {
                let app = this;
                app.projectFeatures.modalStatus = true;
                app.projectFeatures.modalTitle = '编辑版本库';
                app.projectFeatures.info = features;
                this.$nextTick(function () {
                    app.form.setFieldsValue({
                        'name': features.name,
                        'description': features.description
                    });
                });
            },
            deleteFeatures(features) {
                let app = this;
                this.$confirm({
                    'title': '删除版本库',
                    'content': `若将『${features.name}』 删除，所有与版本库相关的信息将会被彻底删除，删除后不可恢复。`,
                    'okText': '删除',
                    'okType': 'danger',
                    'cancelText': '再想想',
                    onOk() {
                        del({'featuresCode': features.code}).then(res => {
                            const result = checkResponse(res);
                            if (!result) {
                                return false;
                            }
                            if (app.currentProjectFeatures.code === features.code) {
                                app.currentProjectFeatures = null;
                            }
                            app.init();
                        });
                        return Promise.resolve();
                    }
                });
            },
            createVersion() {
                let app = this;
                app.projectVersion.modalStatus = true;
                app.projectVersion.info = null;
                app.projectVersion.modalTitle = '创建版本';
            },
            changeVersionStatus(e, versionType, version, index) {
                let app = this;
                if (e.key === version.code) {
                    return false;
                }
                if (e.key === 3) {
                    //请确认当前版本发布内容已全部完成后再发布。
                    this.$confirm({
                        'title': '发布提示',
                        'content': '请确认当前版本发布内容已全部完成后再发布。',
                        'okText': '确认发布',
                        'okType': 'primary',
                        onOk() {
                            app.publishVersion.info = version;
                            app.publishVersion.status = e.key;
                            app.publishVersion.modalStatus = true;
                            app.$nextTick(function () {
                                app.publishVersionForm.setFieldsValue({
                                    'publishTime': moment()
                                });
                            });
                            return Promise.resolve();
                        }
                    });
                } else {
                    changeStatus({'versionCode': version.code, 'status': e.key}).then(res => {
                        this.getProjectVersionList();
                    });
                }
            },
            showVersionDetail(code) {
                this.versionDetail.modalStatus = true;
                this.versionDetail.code = code;
            },
            versionDetailClose() {
                this.versionDetail.modalStatus = false;
                this.versionDetail.code = '';
                this.getProjectVersionList();
            },
            handleSubmitPublishVersion() {
                let app = this;
                app.publishVersionForm.validateFields(
                    (err) => {
                        if (!err) {
                            let obj = app.publishVersionForm.getFieldsValue();
                            obj.publishTime = moment(obj.publishTime).format('YYYY-MM-DD HH:mm');
                            changeStatus({
                                'versionCode': this.publishVersion.info.code,
                                'status': this.publishVersion.status,
                                'publishTime': obj.publishTime
                            }).then(res => {
                                app.publishVersion.modalStatus = false;
                                app.getProjectVersionList();
                            });
                        }
                    });
            },
            handleSubmit() {
                let app = this;
                app.form.validateFields(
                    (err) => {
                        if (!err) {
                            app.handleOk();
                        }
                    });
            },
            handleOk() {
                let app = this;
                app.projectFeatures.confirmLoading = true;
                let obj = app.form.getFieldsValue();
                obj.projectCode = this.code;
                if (app.projectFeatures.info) {
                    obj.featuresCode = app.projectFeatures.info.code;
                    edit(obj).then(res => {
                        app.projectFeatures.confirmLoading = false;
                        if (!checkResponse(res)) {
                            return;
                        }
                        app.form.resetFields();
                        this.getProjectFeaturesList();
                        app.projectFeatures.modalStatus = false;
                    });
                } else {
                    save(obj).then(res => {
                        app.projectFeatures.confirmLoading = false;
                        if (!checkResponse(res)) {
                            return;
                        }
                        app.form.resetFields();
                        app.projectFeatures.modalStatus = false;
                        app.init();
                    });
                }
            },
            handleSubmitProjectVersion() {
                let app = this;
                app.projectVersionForm.validateFields(
                    (err) => {
                        if (!err) {
                            app.handleOkProjectVersion();
                        }
                    });
            },
            handleOkProjectVersion() {
                let app = this;
                app.projectVersion.confirmLoading = true;
                let obj = app.projectVersionForm.getFieldsValue();
                obj.featuresCode = this.currentProjectFeatures.code;
                obj.startTime = moment(obj.startTime).format('YYYY-MM-DD HH:mm');
                obj.planPublishTime = moment(obj.planPublishTime).format('YYYY-MM-DD HH:mm');
                saveProjectVersion(obj).then(res => {
                    app.projectVersion.confirmLoading = false;
                    if (!checkResponse(res)) {
                        return;
                    }
                    app.projectVersionForm.resetFields();
                    app.projectVersion.modalStatus = false;
                    app.getProjectVersionList();
                });
            },
            changeProjectFeatures(e) {
                this.currentProjectFeatures = this.projectFeaturesList.find(item => item.code === e.key);
                this.getProjectVersionList();
            },
            collectProject() {
                const type = this.project.collected ? 'cancel' : 'collect';
                collect(this.project.code, type).then((res) => {
                    if (!checkResponse(res)) {
                        return;
                    }
                    this.project.collected = !this.project.collected;
                });
            },
            formatTime(time) {
                return relativelyTime(time);
            }
        }
    };
</script>

<style lang="less">
    /*@import "../../../../assets/css/exports/task";*/

    .project-space-features {
        .project-navigation {
            top: 65px;
            z-index: 4;
        }

        .wrapper-main {
            background: initial;

        }

        .layout-content {
            padding: 12px;
            width: 1100px;
            margin: 12px auto auto;
            background: initial;
            display: flex;
            flex-direction: row;
            justify-content: space-between;

            .content-item {
                /*background: #fff;*/

                .title {
                    font-size: 16px;
                    padding: 6px 0 0 0;
                }
            }

            .content-wrapper {
                width: 100%;
            }

            .actions {

            }

            .version-content {
                display: flex;
                flex-wrap: wrap;
                margin-bottom: 28px;
                width: calc(100% + 12px);
                flex-shrink: 0;

                .ant-card {
                    width: 345px;
                    height: 102px;
                    margin: 0 6px 16px;
                    flex: 0 0 auto;
                    align-items: center;
                    border-radius: 4px;
                    /*display: inline-block;*/

                    .ant-card-head {
                        padding: 0 16px;
                        border-bottom: none;

                        .ant-card-head-title {
                            padding: 12px 0;
                            display: flex;
                            justify-content: space-between;
                            font-size: 14px;

                            .version-status {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                min-width: 82px;
                                height: 28px;
                                border-radius: 4px;
                                background: #f5f5f5;
                                padding: 4px 8px;

                                &.status-0 {
                                    color: #a6a6a6;
                                }

                                &.status-1 {
                                    color: #1890ff;
                                    background: #e6f7ff;
                                    border-color: #91d5ff;
                                }

                                &.status-2 {
                                    color: #f5222d;
                                    background: #fff1f0;
                                    border-color: #ffa39e;
                                }

                                &.status-3 {
                                    color: #52c41a;
                                    background: #f6ffed;
                                    border-color: #b7eb8f;
                                }
                            }
                        }
                    }

                    .ant-card-body {
                        height: 100%;
                        padding: 0 16px 16px 16px;

                        .publish-time {
                            min-height: 21px;
                        }
                    }
                }

                .version-create {
                    .ant-card-body {
                        padding-top: 16px;
                    }

                    a {
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        text-align: center;
                    }
                }

                &.published {
                    .ant-card {
                        height: auto;
                    }
                }
            }
        }
    }

    .features-list-dropdown {
        cursor: pointer;
    }
</style>
