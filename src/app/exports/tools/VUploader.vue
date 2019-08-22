<template>
    <div :class="{'hidden-files': !showFiles,'hidden-uploader': !showUploader}" class="v-uploader">
        <a-card :title="uploaderTitle">
            <div class="actions" slot="extra">
                <a @click="showFiles = !showFiles" class="muted action-item">
                    <a-icon type="shrink" v-show="showFiles"/>
                    <a-icon type="arrows-alt" v-show="!showFiles"/>
                </a>
                <a @click="closeUploader" class="muted action-item">
                    <a-icon type="close"/>
                </a>
            </div>
            <uploader :autoStart="autoStart"
                      :options="options"
                      @complete="complete"
                      @file-complete="fileComplete"
                      @file-error="fileError"
                      @file-progress="fileProgress"
                      @file-success="fileSuccess"
                      @files-submitted="filesSubmitted"
                      class="uploader-workplace"
                      ref="uploader">
                <vue-scroll>
                    <!--<a-button @click="testSomeThing">测试</a-button>-->
                    <!--<uploader-unsupport></uploader-unsupport>-->
                    <!--<uploader-btn>select files</uploader-btn>-->
                    <!--<uploader-drop>
                        <p>Drop files here to upload or</p>
                        <uploader-btn>select files</uploader-btn>
                        <uploader-btn :attrs="attrs">select images</uploader-btn>
                        <uploader-btn :directory="true">select folder</uploader-btn>
                    </uploader-drop>-->
                    <uploader-list>
                        <template slot-scope="files">
                            <ul class="uploader-wrapper">
                                <uploader-file :file="file" :key="file.id" :list="true"
                                               v-for="file in files.fileList">
                                    <template slot-scope="file">
                                        <li class="uploader-item">
                                            <div class="item-content">
                                                <div class="item-info">
                                                    <div class="file-item">
                                                        <div class="file-icon">
                                                            <a-avatar :src="file.file.fileUrl" icon="link"
                                                                      shape="square"/>
                                                        </div>
                                                        <div class="file-info">
                                                            <div class="file-content">
                                                                <div class="file-title">
                                                                    <a-tooltip :mouseEnterDelay="0.3"
                                                                               :title="file.file.name"
                                                                               placement="top">
                                                                        {{file.file.name}}
                                                                    </a-tooltip>
                                                                </div>
                                                                <div class="file-extra">
                                                                    <span>{{file.file.projectName ? file.file.projectName : tempData.projectName}}</span>
                                                                    <span v-if="file.status == 'success'">({{file.formatedSize }})</span>
                                                                    <span v-else>({{(Number(file.uploadedSize) / (1024 * 1000)).toFixed(2) }}MB/{{file.formatedSize }})</span>
                                                                </div>
                                                            </div>
                                                            <div class="uploader-progress"
                                                                 v-show="file.status != 'success'">
                                                                <a-progress :percent="file.progress * 100"
                                                                            :showInfo="false"
                                                                            :strokeWidth="2"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="item-status">
                                                    <a @click="cancelUpload(file)" class="muted">
                                                        <a-icon type="close" v-show="file.status != 'success'"/>
                                                    </a>
                                                    <a-icon class="text-success" type="check"
                                                            v-show="file.status == 'success'"/>
                                                </div>
                                            </div>
                                        </li>
                                    </template>
                                </uploader-file>
                            </ul>
                        </template>
                    </uploader-list>
                    <!--<uploader-files>
                    </uploader-files>-->
                </vue-scroll>
            </uploader>
        </a-card>
    </div>
</template>

<script>
    import {checkResponse, getAuthorization} from '../../../assets/js/utils';
    import {mapState} from 'vuex';
    import {getStore} from '../../../assets/js/storage';
    import {notice} from '../../../assets/js/notice';
    import {uploadFiles} from '../../frames/restapi/file';

    export default {
        'name': 'v-uploader',
        'props': {
            'code': {
                'type': [String],
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                'loading': false,
                'showFiles': false, //显示上传文件
                'showUploader': false,//显示上传窗口
                'progressTotal': 0, //上传中的文件数
                'completeTotal': 0, //已完成的文件数
                'options': {
                    'target': uploadFiles,
                    'testChunks': false,
                    'query': function () {
                        return getStore('tempData', true);//query暂时无法动态响应
                    },
                    'headers': function () {
                        let organization = getStore('currentOrganization', true);
                        const auth = getAuthorization();
                        auth.organizationcode = organization.code;
                        return auth;
                    }
                },
                'attrs': {
                    'accept': 'image/*'
                },
                'autoStart': true
            };
        },
        'computed': {
            ...mapState({
                'uploader': state => state.common.uploader,
                'tempData': state => state.common.tempData
            }),
            uploaderTitle() {
                if (!this.progressTotal) {
                    return '上传完成';
                }
                let current = this.completeTotal + 1;
                if (current > this.progressTotal) {
                    current = this.progressTotal;
                }
                return `正在上传 ${current}/${this.progressTotal}`;
            }
        },
        'watch': {
            code() {
                this.init();
            }
        },
        created() {
            this.init();
        },
        mounted() {
            this.$nextTick(() => {
                window.uploader = this.$refs.uploader.uploader;
                this.$store.dispatch('setUploader', window.uploader);
            });
        },
        'methods': {
            init() {

            },
            closeUploader() {//关闭上传窗口
                this.showUploader = false;
                this.uploader.cancel();
            },
            filesSubmitted(files) { //添加上传文件
                // this.$refs.uploader.uploader.opts.query = this.tempData;
                this.showUploader = true;
                this.showFiles = true;
                this.progressTotal += files.length;
            },
            fileProgress(rootFile, file, chunk) { //有文件上传中
                this.showUploader = true;
                this.showFiles = true;
            },
            fileSuccess(rootFile, file, message, chunk) { //一个文件上传成功
                const response = JSON.parse(message);
                if (!checkResponse(response)) {
                    notice({'title': response.msg}, 'notice', 'error');
                    return false;
                }
                rootFile.projectName = response.data.projectName;
                rootFile.fileUrl = response.data.url;
                this.completeTotal++;
            },
            fileError(rootFile, file, message, chunk) { //一个文件上传失败                this.progressTotal--;
                this.completeTotal--;
                const response = JSON.parse(message);
                file.cancel();
                rootFile.projectName = response.data.projectName;
                notice({'title': response.msg}, 'notice', 'error');
            },
            fileComplete(rootFile) { //一个文件上传完成
                // console.log('file complete', rootFile);
            },
            complete() { //所有文件上传完成
                this.progressTotal = this.completeTotal = 0;
                notice({'title': '关联文件成功'}, 'notice', 'success');
                setTimeout(() => {
                    this.showFiles = false;
                }, 3000);
            },
            cancelUpload(file) {
                this.progressTotal--;
                this.completeTotal--;
                file.file.cancel();
            },
            filterList(list) {
                //return list;
                return list.reverse();
            },
            testSomeThing() {
                this.uploader.fileList[0].resume();
            }
        }
    };
</script>

<style lang="less">
    @import "~ant-design-vue/lib/style/themes/default";

    .v-uploader {
        position: fixed;
        bottom: 12px;
        right: 24px;
        width: 485px;
        z-index: 1001;
        box-shadow: 0 7px 21px rgba(0, 0, 0, .1);
        transition: bottom 218ms ease;

        .ant-card {
            box-shadow: 0 7px 21px rgba(0, 0, 0, .1);

            .ant-card-head {
                margin-bottom: 0;
                border-bottom: 1px solid #e1e1e1;
            }

            .ant-card-head-title, .ant-card-extra {
                padding: 12px 0;
            }

            .ant-card-body {
                padding: 0;
            }
        }

        &.hidden-files {
            bottom: -241px;
        }

        &.hidden-uploader {
            bottom: -291px;
        }

        .actions {
            .action-item {
                margin-left: 12px;
                font-size: 16px;
            }
        }

        .uploader-workplace {
            height: 240px;
            background-color: #f7f7f7;
            padding: 12px 0 0 12px;

            .uploader-list {
                padding-right: 12px;

                .uploader-wrapper {
                    .uploader-file {
                        padding: 0;
                        height: auto;
                        line-height: 36px;
                        border-bottom: none;
                        border-radius: 4px;

                        .uploader-item {
                            width: 100%;
                            margin-bottom: 8px;
                            background: #eee;

                            .item-content {
                                padding: 6px 12px;
                                display: flex;
                                justify-content: space-between;
                                flex: 1;

                                .item-info {
                                    flex: 1 1 auto;
                                    position: relative;
                                    overflow: hidden;
                                    text-overflow: ellipsis;
                                    white-space: nowrap;

                                    .file-item {
                                        display: flex;

                                        .file-icon {
                                            margin-right: 8px;
                                        }

                                        .file-info {
                                            width: 100%;
                                            min-width: 0;
                                            padding: 4px 0;
                                            line-height: 16px;
                                            display: flex;
                                            flex-direction: column;
                                            justify-content: center;

                                            .file-content {
                                                width: 100%;
                                                display: flex;
                                                align-items: center;
                                                justify-content: space-between;

                                                .file-title {
                                                    max-width: 210px;
                                                    text-overflow: ellipsis;
                                                    overflow: hidden;
                                                    min-width: 0;
                                                }

                                                .file-extra {
                                                    display: flex;
                                                    align-items: center;
                                                    max-width: 200px;
                                                    margin-left: 16px;
                                                    color: gray;
                                                    font-size: 12px;

                                                    span {
                                                        margin-left: 3px;
                                                    }
                                                }
                                            }
                                        }

                                        .uploader-progress {
                                            .ant-progress-outer {
                                                margin: 0;
                                            }
                                        }
                                    }
                                }

                                .item-status {
                                    display: flex;
                                    justify-content: flex-end;
                                    align-items: center;
                                    width: 30px;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>
