<template>
    <div class="account-setting-security">
        <wrapper :showHeader="false">
            <div class="setting-content">
                <member-setting :keys="['security']"></member-setting>
                <div class="layout-item right">
                    <div class="setting-info-title">
                        <span>安全设置</span>
                    </div>
                    <div class="setting-info">
                        <div class="setting-info-content">
                            <div class="ant-list ant-list-split">
                                <div class="ant-spin-nested-loading">
                                    <div class="ant-spin-container">
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>账户密码</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">当前密码强度 : 强</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li @click="editPassword"><a>修改</a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>手机账号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">
                                                                <span v-if="userInfo.mobile">已绑定手机 : {{userInfo.mobile}}</span>
                                                                <span v-else>未绑定手机</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li @click="editMobile"><a>
                                                    <span v-if="userInfo.mobile">修改</span>
                                                    <span v-else>绑定</span>
                                                </a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>邮箱帐号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">
                                                                  <span v-if="userInfo.email">已绑定邮箱 : {{userInfo.email}}</span>
                                                                <span v-else>未绑定邮箱</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li @click="editMail"><a>
                                                    <span v-if="userInfo.email">修改</span>
                                                    <span v-else>绑定</span>
                                                </a></li>
                                            </ul>
                                        </div>
                                        <div class="ant-list-item">
                                            <div class="ant-list-item-meta">
                                                <div class="ant-list-item-meta-content">
                                                    <h4 class="ant-list-item-meta-title"><a>钉钉账号</a></h4>
                                                    <div class="ant-list-item-meta-description">
                                                        <span>
                                                            <span class="security-list-description">
                                                                  <span v-if="userInfo.dingtalk_unionid">已绑定</span>
                                                                <span v-else>未绑定钉钉账号</span>
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <ul class="ant-list-item-action">
                                                <li @click="unbindDingtalk" v-if="userInfo.dingtalk_unionid"><a>解除绑定</a>
                                                </li>
                                                <li @click="bindDingtalk" v-else><a>绑定</a></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </wrapper>
        <a-modal
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
                :title="passwordInfo.modalTitle"
                :width="385"
                v-model="passwordInfo.modalStatus"
        >
            <a-alert :message="errorTips"
                     style="margin-bottom: 12px;"
                     type="error"
                     v-show="errorTips"
            />
            <a-form
                    :autoFormCreate="(form)=>{this.form = form}"
                    :form="form"
                    @submit.prevent="handlePasswordSubmit"
                    hideRequiredMark
                    layout="vertical">
                <a-form-item
                        label='原密码'
                >
                    <a-input
                            type="password"
                            v-decorator="[
                                            'password',
                                            {rules: [{ required: true, message: '请输入原密码' }]}
                                            ]"
                    />
                </a-form-item>
                <a-form-item
                        label='新密码'
                >
                    <a-input
                            type="password"
                            v-decorator="[
                                            'newPassword',
                                            {rules: [{ required: true, message: '请输入新密码' }]}
                                            ]"
                    />
                </a-form-item>
                <a-form-item
                        label='确认新密码'
                >
                    <a-input
                            type="password"
                            v-decorator="[
                                            'confirmPassword',
                                            {rules: [{ required: true, message: '请确认新密码' }]}
                                            ]"
                    />
                </a-form-item>
                <a-form-item
                >
                    <a-button block htmlType='submit' size="large" type='primary'>保存</a-button>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
                :title="mobileInfo.modalTitle"
                :width="385"
                class="mobile-modal"
                v-model="mobileInfo.modalStatus"
        >
            <a-alert :message="errorTips"
                     style="margin-bottom: 12px;"
                     type="error"
                     v-show="errorTips"
            />
            <a-form
                    :form="mobileForm"
                    @submit.prevent="handleMobileSubmit"
                    hideRequiredMark
                    layout="vertical">
                <a-form-item
                >
                    <a-input placeholder="手机号" size="large" type="text"
                             v-decorator="[
                                'mobile',
                                {rules: [{ required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确的手机号' }], validateTrigger: 'change'}
                            ]">
                        <a-icon :style="{ color: 'rgba(0,0,0,.25)' }" slot="prefix" type="mobile"/>
                    </a-input>
                </a-form-item>

                <a-row :gutter="16">
                    <a-col :span="16" class="gutter-row">
                        <a-form-item
                        >
                            <a-input placeholder="验证码" size="large" type="text"
                                     v-decorator="[
                                'captcha',
                                {rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}
                            ]">
                                <a-icon :style="{ color: 'rgba(0,0,0,.25)' }" slot="prefix" type="mail"/>
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8" class="gutter-row">
                        <a-button
                                :disabled="mobileInfo.state.smsSendBtn"
                                @click.stop.prevent="getCaptcha"
                                class="getCaptcha"
                                size="large"
                                tabindex="-1"
                                v-text="!mobileInfo.state.smsSendBtn && '获取验证码' || (mobileInfo.state.time+' s')"
                        ></a-button>
                    </a-col>
                </a-row>
                <a-form-item
                >
                    <a-button :disabled="mobileInfo.confirmLoading" :loading="mobileInfo.confirmLoading" block htmlType='submit' size="large"
                              type='primary'>绑定
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
        <a-modal
                :bodyStyle="{paddingBottom:'1px'}"
                :footer="null"
                :title="mailInfo.modalTitle"
                :width="385"
                class="mail-modal"
                v-model="mailInfo.modalStatus"
        >
            <a-alert :message="errorTips"
                     style="margin-bottom: 12px;"
                     type="error"
                     v-show="errorTips"
            />
            <a-form
                    :form="mailForm"
                    @submit.prevent="handleMailSubmit"
                    hideRequiredMark
                    layout="vertical">
                <a-form-item
                >
                    <a-input placeholder="邮箱地址" size="large" type="text"
                             v-decorator="[
                                'mail',
                                {rules: [{ required: true, pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/, message: '请输入正确的邮箱地址' }], validateTrigger: 'change'}
                            ]">
                        <a-icon :style="{ color: 'rgba(0,0,0,.25)' }" slot="prefix" type="mail"/>
                    </a-input>
                </a-form-item>
                <a-form-item
                >
                    <a-button :disabled="mailInfo.confirmLoading" :loading="mailInfo.confirmLoading" block htmlType='submit' size="large"
                              type='primary'>保存
                    </a-button>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>

<script>
    import md5 from 'md5';
    import {mapState} from 'vuex';
    import setting from './setting';
    import {checkResponse} from '../../shared/utils';
    import {_bindMail, _bindMobile, _unbindDingtalk, editPassword, getCaptcha} from '../../feature/restapi/api.member';
    import {dingTalkOauth} from '../../feature/restapi/api.ding.talk';

    export default {
        'name': 'security',
        'components': {
            setting
        },
        data() {
            return {
                'form': this.$form.createForm(this),
                'mobileForm': this.$form.createForm(this),
                'mailForm': this.$form.createForm(this),
                'errorTips': '',
                'passwordInfo': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'modalTitle': '修改密码',
                    'okText': '保存',
                    'cancelText': '放弃'
                },
                'mobileInfo': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'modalTitle': '修改手机',
                    'okText': '保存',
                    'cancelText': '放弃',
                    'state': {
                        'time': 60,
                        'smsSendBtn': false
                    }
                },
                'mailInfo': {
                    'modalStatus': false,
                    'confirmLoading': false,
                    'modalTitle': '修改邮箱',
                    'okText': '保存',
                    'cancelText': '放弃',
                    'state': {
                        'time': 60,
                        'smsSendBtn': false
                    }
                }
            };
        },
        'computed': {
            ...mapState({
                'userInfo': state => state.userInfo
            })
        },
        'methods': {
            editPassword() {
                this.passwordInfo.modalStatus = true;
            },
            editMobile() {
                this.mobileInfo.modalStatus = true;
            },
            editMail() {
                this.mailInfo.modalStatus = true;
            },
            bindDingtalk() {
                let url = dingTalkOauth() + '?redirectPath=' + this.$route.fullPath + '&bindDingtalk=1';
                location.href = url;
            },
            unbindDingtalk() {
                let app = this;
                this.$confirm({
                    'title': '确认解绑',
                    'content': '解除绑定后将无法使用该帐号进行登录',
                    'okText': '确定',
                    'okType': 'danger',
                    'cancelText': '再想想',
                    onOk() {
                        _unbindDingtalk().then((res) => {
                            const result = checkResponse(res);
                            if (!result) {
                                return false;
                            }
                            app.$store.dispatch('SET_USER', res.data);
                        });
                        return Promise.resolve();
                    }
                });
            },
            handlePasswordSubmit() {
                let app = this;
                this.form.validateFields(
                    (err) => {
                        if (!err) {
                            let obj = app.form.getFieldsValue();
                            if (obj.password.length < 6 || obj.newPassword.length < 6 || obj.confirmPassword.length < 6) {
                                this.setErrorTips('密码必须包含6个字符');
                                return false;
                            }
                            if (obj.newPassword !== obj.confirmPassword) {
                                this.setErrorTips('两次新密码不匹配');
                                return false;
                            }
                            this.setErrorTips('');
                            obj.id = app.userInfo.id;
                            obj.password = md5(obj.password);
                            obj.newPassword = md5(obj.newPassword);
                            obj.confirmPassword = md5(obj.confirmPassword);
                            editPassword(obj).then(res => {
                                app.loading = false;
                                if (!checkResponse(res)) {
                                    return;
                                }
                                this.passwordInfo.modalStatus = false;
                                app.form && app.form.resetFields();
                            });
                        }
                    }
                );
            },
            handleMobileSubmit() {
                let app = this;
                this.mobileForm.validateFields(
                    (err) => {
                        if (!err) {
                            let obj = app.mobileForm.getFieldsValue();
                            this.setErrorTips('');
                            app.mobileInfo.confirmLoading = true;
                            _bindMobile(obj).then(res => {
                                app.mobileInfo.confirmLoading = false;
                                if (!checkResponse(res)) {
                                    return;
                                }
                                const obj = {
                                    'userInfo': res.data.member,
                                    'tokenList': res.data.tokenList
                                };
                                app.$store.dispatch('SET_LOGGED', obj);
                                this.mobileInfo.modalStatus = false;
                                app.mobileForm && app.mobileForm.resetFields();
                            });
                        }
                    }
                );
            },
            handleMailSubmit() {
                let app = this;
                this.mailForm.validateFields(
                    (err) => {
                        if (!err) {
                            let obj = app.mailForm.getFieldsValue();
                            this.setErrorTips('');
                            app.mailInfo.confirmLoading = true;
                            _bindMail(obj).then(res => {
                                app.mailInfo.confirmLoading = false;
                                if (!checkResponse(res)) {
                                    return;
                                }
                                this.mailInfo.modalStatus = false;
                                app.mailForm && app.mailForm.resetFields();
                            });
                        }
                    }
                );
            },
            setErrorTips(content = '') {
                this.errorTips = content;
            },
            getCaptcha(e) {
                e.preventDefault();
                const app = this;

                this.mobileForm.validateFields(['mobile'], {'force': true}, (err, values) => {
                    if (!err) {
                        this.mobileInfo.state.smsSendBtn = true;

                        const interval = window.setInterval(() => {
                            if (app.mobileInfo.state.time-- <= 0) {
                                app.mobileInfo.state.time = 60;
                                app.mobileInfo.state.smsSendBtn = false;
                                window.clearInterval(interval);
                            }
                        }, 1000);

                        this.$message.loading('验证码发送中..', 0);
                        getCaptcha(values.mobile)
                            .then(res => {
                                this.$message.destroy();

                                if (!checkResponse(res)) {
                                    return false;
                                }
                                let tips = '验证码获取成功';
                                if (res.data) {
                                    tips += '，您的验证码为：' + res.data;
                                }
                                this.$notification.success({
                                    'message': '提示',
                                    'description': tips,
                                    'duration': 8,
                                    'placement': 'bottomLeft'
                                });
                            })['catch'](err => {
                            // setTimeout(hide, 1);
                            clearInterval(interval);
                            app.mobileInfo.state.time = 60;
                            app.mobileInfo.state.smsSendBtn = false;
                            this.requestFailed(err);
                        });
                    }
                });
            }
        }
    };
</script>

<style lang="less">
    .member-setting-security {
        .wrapper-main {
            padding-left: 0;
        }

        .setting-content {
            display: flex;
            flex-direction: row;

            .right {
                flex: 1 1 0;
                padding: 8px 40px;

                .setting-info-title {
                    font-size: 20px;
                }

                .setting-info {
                    display: flex;
                    flex-direction: row;
                    padding-top: 12px;

                    &-content {
                        width: 100%;
                    }
                }
            }
        }
    }

    .mobile-modal {
        .getCaptcha {
            display: block;
            width: 100%;
            height: 40px;
        }
    }
</style>
