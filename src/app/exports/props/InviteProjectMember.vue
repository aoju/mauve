<template>
    <div>
        <a-modal
                :footer="null"
                :title="actionInfo.modalTitle"
                :width="360"
                @cancel="cancel"
                class="invite-project-member"
                v-model="actionInfo.modalStatus"
        >
            <div class="header">
                <span>账号邀请</span>
                <a @click="createInviteLink">通过链接邀请</a>
            </div>
            <div class="search-content">
                <a-input placeholder="输入昵称或邮箱查找" v-model="keyword">
                    <a-icon slot="prefix" type="search"/>
                </a-input>
            </div>
            <div class="member-list">
                <a-list
                        :dataSource="list"
                        :loading="searching"
                        :locale="{emptyText: (keyword && keyword.length > 1) ? '没有搜索到相关成员' : ''}"
                        class="project-list"
                        itemLayout="horizontal"
                >
                    <a-list-item slot="renderItem" slot-scope="item">
                    <span slot="actions">
                        <a-button @click="invite(item)" icon="user-add" size="small"
                                  type="dashed"
                                  v-if="!item.joined"
                        >邀请</a-button>
                        <template v-else>
                             <a-icon type="user"></a-icon>
                            <span> 已加入</span>
                        </template>
                     </span>
                        <a-list-item-meta
                                :description="item.email"
                        >
                            <span slot="title">{{item.name}}</span>
                            <a-avatar :src="item.avatar" icon="user" slot="avatar"/>
                        </a-list-item-meta>
                    </a-list-item>
                </a-list>
            </div>
        </a-modal>
        <a-modal
                :footer="null"
                :title="linkInfo.modalTitle"
                :width="600"
                class="invite-link"
                v-model="linkInfo.modalStatus"
        >
            <div class="header">
                <p>链接有效日期：{{linkInfo.overTime}}</p>
                <a-input-search
                        enterButton="复制链接"
                        size="large"
                        v-clipboard:copy="linkInfo.link"
                        v-model="linkInfo.link"
                />
            </div>
        </a-modal>
    </div>

</template>

<script>
    import _ from 'lodash';
    import moment from 'moment';
    import {inviteMember, searchInviteMember} from '../../feature/restapi/projectMember';
    import {checkResponse} from '../../../assets/js/utils';
    import {createInviteLink} from '../../feature/restapi/common';

    export default {
        'name': 'inviteProjectMember',
        'props': {
            'value': {
                'type': Boolean,
                default() {
                    return false;
                }
            },
            'projectCode': {
                'type': [String, Number],
                default() {
                    return '';
                }
            }
        },
        data() {
            return {
                'form': this.$form.createForm(this),
                'actionInfo': {
                    'modalStatus': this.value,
                    'confirmLoading': false,
                    'modalTitle': '邀请新成员'
                },
                'linkInfo': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'modalTitle': '邀请成员',
                    'link': '',
                    'overTime': ''
                },
                'keyword': '',
                'searching': false,
                'list': []
                // emptyText: keyword ? '没有搜索结果' : ''
            };
        },
        'watch': {
            value(value) {
                this.actionInfo.modalStatus = value;
            },
            keyword() {
                this.search();
            }
        },
        'methods': {
            invite(item) {
                inviteMember(item.memberCode, this.projectCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                    }
                });
            },
            createInviteLink() {
                if (!this.linkInfo.link) {
                    createInviteLink({'inviteType': 'project', 'sourceCode': this.projectCode}).then(res => {
                        const success = checkResponse(res);
                        if (success) {
                            this.linkInfo.modalStatus = true;
                            this.linkInfo.link = window.location.href.split('#')[0] + '#/invite_from_link/' + res.data.code;
                            this.linkInfo.overTime = moment(res.data.code.over_time).format('YYYY年M月D日 HH:mm');
                        }
                    });
                } else {
                    this.linkInfo.modalStatus = true;
                }
            },
            'search': _.debounce(
                function () {
                    if (!this.keyword) {
                        this.list = [];
                    }
                    if (this.keyword.length <= 1) {
                        return false;
                    }
                    this.searching = true;
                    searchInviteMember(this.keyword, this.projectCode).then(res => {
                        this.searching = false;
                        this.list = res.data;
                    });
                }, 500
            ),
            cancel() {
                this.actionInfo.modalStatus = false;
                this.$emit('input', this.actionInfo.modalStatus);
            }
        }
    };
</script>

<style lang="less">
    .invite-project-member {
        .ant-modal-body {
            padding-top: 0;
            padding-bottom: 24px;
            min-height: 40vh;
        }

        .header {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            padding: 12px 0;
        }

        .member-list {
            padding-top: 12px;
        }

    }
</style>
