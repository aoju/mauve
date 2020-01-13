<template>
    <div class="user-layout-register">
        <a-form :autoFormCreate="(form)=>{this.form = form}" id="formRegister" ref="formRegister">
            <a-form-item
                    :fieldDecoratorOptions="{rules: [{ required: true, type: 'email', message: '请输入邮箱地址' }], validateTrigger: ['change', 'blur']}"
                    fieldDecoratorId="email">

                <a-input placeholder="邮箱" size="large" type="text"></a-input>
            </a-form-item>
            <a-form-item
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入姓名' }], validateTrigger: ['change', 'blur']}"
                    fieldDecoratorId="name">

                <a-input placeholder="姓名" size="large" type="text"></a-input>
            </a-form-item>

            <a-popover :visible="state.passwordLevelChecked" placement="rightTop" trigger="click">
                <template slot="content">
                    <div :style="{ width: '240px' }">
                        <div :class="['user-register', passwordLevelClass]">强度：<span>{{ passwordLevelName }}</span>
                        </div>
                        <a-progress :percent="state.percent" :showInfo="false" :strokeColor=" passwordLevelColor "/>
                        <div style="margin-top: 10px;">
                            <span>请至少输入 6 个字符。请不要使用容易被猜到的密码。</span>
                        </div>
                    </div>
                </template>
                <a-form-item
                        :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码，区分大小写'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}"
                        fieldDecoratorId="password">
                    <a-input @click="handlePasswordInputClick" autocomplete="false" placeholder="密码须至少6位，且区分大小写" size="large"
                             type="password"></a-input>
                </a-form-item>
            </a-popover>

            <a-form-item
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '至少6位密码，区分大小写' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}"
                    fieldDecoratorId="password2">

                <a-input autocomplete="false" placeholder="再次确认您的密码" size="large" type="password"></a-input>
            </a-form-item>

            <a-form-item
                    :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }, { validator: this.handlePhoneCheck } ], validateTrigger: ['change', 'blur'] }"
                    fieldDecoratorId="mobile">
                <a-input placeholder="11 位手机号" size="large">
                    <a-select defaultValue="+86" size="large" slot="addonBefore">
                        <a-select-option value="+86">+86</a-select-option>
                        <!--<a-select-option value="+87">+87</a-select-option>-->
                    </a-select>
                </a-input>
            </a-form-item>
            <a-row :gutter="16" style="margin-top: 12px;">
                <a-col :span="16" class="gutter-row">
                    <a-form-item
                            :fieldDecoratorOptions="{rules: [{ required: true, message: '请输入验证码' }], validateTrigger: 'blur'}"
                            fieldDecoratorId="captcha">
                        <a-input placeholder="验证码" size="large" type="text">
                            <a-icon :style="{ color: 'rgba(0,0,0,.25)' }" slot="prefix" type='safety-certificate'/>
                        </a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="8" class="gutter-row">
                    <a-button
                            :disabled="state.smsSendBtn"
                            @click.stop.prevent="getCaptcha"
                            class="getCaptcha"
                            size="large"
                            v-text="!state.smsSendBtn && '获取验证码'||(state.time+' s')"></a-button>
                </a-col>
            </a-row>

            <a-form-item>
                <a-button
                        :disabled="registerBtn"
                        :loading="registerBtn"
                        @click.stop.prevent="handleSubmit"
                        class="register-button"
                        htmlType="submit"
                        size="large"
                        type="primary">注册
                </a-button>
                <router-link :to="{ name: 'login' }" class="login">使用已有账户登录</router-link>
            </a-form-item>

        </a-form>
    </div>
</template>

<script>
    import md5 from 'md5';
    import {getCaptcha, register} from '../../feature/restapi/api.member';
    import {checkResponse} from '../../shared/utils';
    import {notice} from '../../shared/notify';

    const levelNames = {
        '0': '低',
        '1': '低',
        '2': '中',
        '3': '强'
    };
    const levelClass = {
        '0': 'error',
        '1': 'error',
        '2': 'warning',
        '3': 'success'
    };
    const levelColor = {
        '0': '#ff0000',
        '1': '#ff0000',
        '2': '#ff7e05',
        '3': '#52c41a'
    };
    export default {
        'name': 'Register',
        'components': {},
        data() {
            return {
                'form': null,

                'state': {
                    'time': 60,
                    'smsSendBtn': false,
                    'passwordLevel': 0,
                    'passwordLevelChecked': false,
                    'percent': 10,
                    'progressColor': '#FF0000'
                },
                'registerBtn': false
            };
        },
        'computed': {
            passwordLevelClass() {
                return levelClass[this.state.passwordLevel];
            },
            passwordLevelName() {
                return levelNames[this.state.passwordLevel];
            },
            passwordLevelColor() {
                return levelColor[this.state.passwordLevel];
            }
        },
        'methods': {

            handlePasswordLevel(rule, value, callback) {
                let level = 0;

                // 判断这个字符串中有没有数字
                if ((/[0-9]/).test(value)) {
                    level++;
                }
                // 判断字符串中有没有字母
                if ((/[a-zA-Z]/).test(value)) {
                    level++;
                }
                // 判断字符串中有没有特殊符号
                if ((/[^0-9a-zA-Z_]/).test(value)) {
                    level++;
                }
                this.state.passwordLevel = level;
                this.state.percent = level * 30;
                if (level >= 2) {
                    if (level >= 3) {
                        this.state.percent = 100;
                    }
                    callback();
                } else {
                    if (level === 0) {
                        this.state.percent = 10;
                    }
                    callback(new Error('密码强度不够'));
                }
            },

            handlePasswordCheck(rule, value, callback) {
                const password = this.form.getFieldValue('password');
                if (value === undefined) {
                    callback(new Error('请输入密码'));
                }
                if (value && password && value.trim() !== password.trim()) {
                    callback(new Error('两次密码不一致'));
                }
                callback();
            },

            handlePhoneCheck(rule, value, callback) {
                callback();
            },

            handlePasswordInputClick() {
                this.state.passwordLevelChecked = true;
            },

            handleSubmit() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        this.registerBtn = true;
                        let params = this.form.getFieldsValue();
                        params.password = md5(params.password);
                        params.password2 = md5(params.password2);
                        register(params).then(res => {
                            this.registerBtn = false;
                            if (!checkResponse(res)) {
                                return false;
                            }
                            notice({'title': '提示', 'msg': '注册成功，请登陆'}, 'notification', 'success');
                            this.$router.push({'name': 'login'});
                        });
                    }
                });
            },

            getCaptcha(e) {
                e.preventDefault();
                const that = this;

                this.form.validateFields(['mobile'], {'force': true},
                    (err, values) => {
                        if (!err) {
                            this.state.smsSendBtn = true;

                            const interval = window.setInterval(() => {
                                if (that.state.time-- <= 0) {
                                    that.state.time = 60;
                                    that.state.smsSendBtn = false;
                                    window.clearInterval(interval);
                                }
                            }, 1000);

                            const hide = this.$message.loading('验证码发送中..', 0);
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
                                setTimeout(hide, 1);
                                clearInterval(interval);
                                this.state.time = 60;
                                this.state.smsSendBtn = false;
                                this.requestFailed(err);
                            });
                        }
                    }
                );
            },
            requestFailed(err) {
                this.$notification.error({
                    'message': '错误',
                    'description': ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
                    'duration': 4
                });
                this.registerBtn = false;
            }
        },
        'watch': {
            'state.passwordLevel'(val) {

            }
        }
    };
</script>
<style lang="less" scoped>
    .user-register {

        &.error {
            color: #ff0000;
        }

        &.warning {
            color: #ff7e05;
        }

        &.success {
            color: #52c41a;
        }
    }

    .user-layout-register {
        .ant-input-group-addon:first-child {
            background-color: #fff;
        }
    }

    .user-layout-register {

        & > h3 {
            font-size: 16px;
            margin-bottom: 20px;
        }

        .getCaptcha {
            display: block;
            width: 100%;
            height: 40px;
            margin-top: 2px;
        }

        .register-button {
            width: 50%;
        }

        .login {
            color: #fff;
            float: right;
            line-height: 40px;
        }

        .ant-form-item {
            margin-bottom: 2px;
            margin-top: 2px;
        }

        .ant-btn-primary {
            color: #fff;
            background-color: #44C97D;
            border-color: #fff;
        }

        .ant-btn-primary:hover, .ant-btn-primary:focus {
            color: #fff;
            background-color: #35af69;
            border-color: #fff;
        }
    }
</style>
