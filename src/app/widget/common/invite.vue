<template>
    <div class="inviteFromLink" style="height: 100%;">
        <div class="content">
            <a-spin :spinning="loading">
                <a-card :title="`来自 ${inviteLink.member.name} 的邀请`" v-if="inviteLink">
                    <div class="header">
                    <span>
                        {{inviteLink.member.name}} 邀请你
                        <span v-if="inviteLink.invite_type == 'project'">加入项目「{{inviteLink.sourceDetail.name}}」</span>
                        <span v-if="inviteLink.invite_type == 'organization'">加入组织「{{inviteLink.sourceDetail.name}}」</span>

                    </span>
                    </div>
                    <div class="member-info">
                        <div class="avatar">
                            <a-avatar :src="inviteLink.member.avatar" size="large"></a-avatar>
                        </div>
                        <div class="info">
                            <p>{{inviteLink.member.name}}</p>
                            <p class="muted">{{inviteLink.member.email}}</p>
                        </div>
                    </div>
                    <a-button @click="acceptInvite" block class="middle-btn" size="large" type="primary">
                        <span v-if="inviteLink.invite_type == 'project'">加入项目</span>
                        <span v-if="inviteLink.invite_type == 'organization'">加入组织</span>
                    </a-button>
                </a-card>
            </a-spin>
        </div>
    </div>
</template>
<script>
    import {mapState} from 'vuex';
    import {checkResponse} from '../../shared/utils';
    import {inviteInfo} from '../../feature/restapi/api.index';
    import {_joinByInviteLink} from '../../feature/restapi/api.project.member';
    import {_joinByInviteLink as joinOrganation} from '../../feature/restapi/api.member';

    export default {
        data() {
            return {
                'loading': false,
                'inviteLink': undefined
            };
        },
        'computed': {
            ...mapState({
                'userInfo': state => state.userInfo
            })
        },
        created() {
            this.getInviteInfo();
        },
        'methods': {
            getInviteInfo() {
                this.loading = true;
                inviteInfo(this.$route.params.code).then(res => {
                    this.inviteLink = res.data;
                    this.loading = false;
                });
            },
            acceptInvite() {
                let app = this;
                if (this.inviteLink.invite_type === 'project') {
                    _joinByInviteLink(this.$route.params.code).then(res => {
                        const result = checkResponse(res);
                        if (!result) {
                            return false;
                        }
                        this.$store.dispatch('setOrganizationList', res.data.organizationList);
                        this.$store.dispatch('setCurrentOrganization', res.data.currentOrganization);
                        setTimeout(function () {
                            app.$router.replace({'name': 'task', 'params': {'code': app.inviteLink.source_code}});
                        }, 500);
                    });
                } else if (this.inviteLink.invite_type === 'organization') {
                    joinOrganation(this.$route.params.code).then(res => {
                        this.$store.dispatch('setOrganizationList', res.data.organizationList);
                        this.$store.dispatch('setCurrentOrganization', res.data.currentOrganization);
                        this.$notice({'title': '你已成功加入组织', 'msg': '你可以在右上方切换当前组织'}, 'notice', 'success');
                        setTimeout(function () {
                            app.$router.replace('/');
                        }, 500);
                    });
                }
            }
        }
    };
</script>
<style lang="less">
    .inviteFromLink {
        .content {
            width: 600px;
            margin: 50px auto;

            .header {
                font-size: 18px;
            }

            .member-info {
                margin: 36px 0;
                display: flex;
                align-items: center;

                .avatar {
                    margin-right: 12px;
                }

                .info {
                    p {
                        margin: 0;
                    }
                }
            }
        }
    }
</style>
