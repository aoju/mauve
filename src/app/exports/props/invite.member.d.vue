<template>
    <div>
        <a-modal
                :footer="null"
                :title="actionInfo.modalTitle"
                :width="360"
                @cancel="cancel"
                class="invite-department-member"
                v-model="actionInfo.modalStatus"
        >
            <div class="header">
                <span>账号邀请</span>
                <a @click="createInviteLink" v-if="!departmentCode">通过链接邀请</a>
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
                        >添加</a-button>
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
    import moment from 'moment';
    import _ from 'lodash';
    import {inviteMember, searchInviteMember} from '../../feature/restapi/api.department.member';
    import {checkResponse} from '../../../assets/js/utils';
    import {createInviteLink} from '../../feature/restapi/api.index';

    export default {
        'name': 'inviteDepartmentMember',
        'props': {
            'value': {
                'type': Boolean,
                default() {
                    return false;
                }
            },
            'departmentCode': {
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
                    'modalTitle': this.departmentCode ? '添加成员至部门' : '添加成员至组织'
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
        created() {
            if (this.departmentCode) {
                this.searching = true;
                searchInviteMember(this.keyword, this.departmentCode).then(res => {
                    this.searching = false;
                    this.list = res.data;
                });
            }
        },
        'methods': {
            invite(item) {
                inviteMember(item.accountCode, this.departmentCode).then((res) => {
                    const success = checkResponse(res);
                    if (success) {
                        item.joined = true;
                        this.$emit('update', item);
                    }
                });
            },
            createInviteLink() {
                if (!this.linkInfo.link) {
                    createInviteLink({
                        'inviteType': 'organization',
                        'sourceCode': this.$store.state.currentOrganization.code
                    }).then(res => {
                        const success = checkResponse(res);
                        if (success) {
                            this.linkInfo.modalStatus = true;
                            this.linkInfo.link = window.location.href.split('#')[0] + '#/invite_from_link/' + res.data.code;
                            this.linkInfo.overTime = moment(res.data.over_time).format('YYYY年M月D日 HH:mm');
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
                    searchInviteMember(this.keyword, this.departmentCode).then(res => {
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
    .invite-department-member {
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
