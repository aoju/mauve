<template>
    <div class="reset-mail" style="height: 100%;">
        <div class="content">
            <a-card :title="isSuccess ? '验证成功' : '验证失败'" v-if="!loading">
                <div class="header m-b-lg text-center">
                    <p>
                        <a-icon :class="{ 'icon': true, 'isSuccess': isSuccess, 'error': !isSuccess }"
                                :type="isSuccess ? 'check-circle' : 'close-circle'"/>
                    </p>
                    <span v-if="isSuccess">
                      您已成功绑定邮箱
                    </span>
                    <span v-else>
                        <span v-if="tips">{{tips}}</span>
                        <span v-else>绑定邮箱失败</span>
                    </span>
                </div>
                <a-button @click="routerLink('/home', true)" block class="middle-btn" size="large" type="primary">
                    <span>进入首页</span>
                </a-button>
            </a-card>
        </div>
    </div>
</template>
<script>

    import {_checkBindMail} from '../../feature/restapi/api.member';
    import {checkResponse} from '../../shared/utils';

    export default {
        data() {
            return {
                'loading': true,
                'isSuccess': false,
                'tips': ''
            };
        },
        created() {
            this.checkBindMail();
        },
        'methods': {
            checkBindMail() {
                _checkBindMail({'token': this.$route.query.token}).then(res => {
                    this.loading = false;
                    if (!checkResponse(res)) {
                        this.tips = res.msg;
                        return false;
                    }
                    this.isSuccess = true;
                });
            }
        }
    };
</script>
<style lang="less">
    .reset-mail {
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

        .icon {
            font-size: 72px;
            line-height: 72px;
            margin-bottom: 0px;
        }

        .isSuccess {
            color: #52c41a;
        }

        .error {
            color: red;
        }
    }
</style>
