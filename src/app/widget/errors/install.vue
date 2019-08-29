<template>
    <div class="install" style="height: 100%;">
        <user-layout desc="正在安装项目管理系统">
            <div class="main">
                <a-form
                        :form="form"
                        @submit.prevent="handleSubmit"
                        class="user-layout-login"
                        layout="horizontal"
                >

                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="数据库地址"
                    >
                        <a-input
                                placeholder="MySQL 数据库地址"
                                size="large"
                                type="text"
                                v-decorator="[
                                'mysqlHost',
                                {rules: [{ required: true, message: '请输入MySQL 数据库地址' }], validateTrigger: 'change',initialValue: '127.0.0.1'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="数据库名"
                    >
                        <a-input
                                placeholder="MySQL 数据库名"
                                size="large"
                                type="text"
                                v-decorator="[
                                'mysqlDatabase',
                                {rules: [{ required: true, message: '请输入MySQL 数据库名' }], validateTrigger: 'change',initialValue: 'pearproject'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="用户名"
                    >
                        <a-input placeholder="MySQL 用户名" size="large" type="text"
                                 v-decorator="[
                                'mysqlUsername',
                                {rules: [{ required: true, message: '请输入MySQL 用户名' }], validateTrigger: 'change',initialValue: 'root'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="密码"
                    >
                        <a-input placeholder="MySQL 密码" size="large" type="password"
                                 v-decorator="[
                                'mysqlPassword',
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="数据表前缀"
                    >
                        <a-input placeholder="MySQL 数据表前缀" size="large" type="text"
                                 v-decorator="[
                                'mysqlPrefix',
                                {rules: [{ required: true, message: '请输入MySQL 数据表前缀' }], validateTrigger: 'change',initialValue: 'pear_'}
                            ]"
                        >
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="端口号"
                    >
                        <a-input placeholder="MySQL 端口号" size="large" type="text"
                                 v-decorator="[
                                'mysqlHostport',
                                {rules: [{ required: true, message: '请输入MySQL 端口号' }], validateTrigger: 'change',initialValue: '3306'}
                            ]">
                        </a-input>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18}"
                            label="清除数据"
                    >
                        <a-checkbox
                                v-decorator="[
                                'initData',
                                {initialValue: false}
                            ]"
                        >
                            勾选后将清除预置数据
                        </a-checkbox>
                    </a-form-item>
                    <a-form-item
                            :labelCol="{ span: 6 }"
                            :wrapperCol="{ span: 18, offset: 6}"
                            style="margin-top:24px">
                        <a-button
                                :disabled="loading"
                                :loading="loading"
                                block
                                class="middle-btn"
                                htmlType="submit"
                                size="large"
                                type="primary"
                        >
                            <span v-if="!loading">立即安装</span>
                            <span v-else>正在安装，请稍后...</span>
                        </a-button>
                    </a-form-item>
                </a-form>
            </div>
        </user-layout>
    </div>
</template>
<script>
    import {checkInstall, install} from '../../feature/restapi/api.index';
    import {checkResponse} from '../../../assets/js/utils';
    import Index from '../../frames/home/index';

    export default {
        'components': {
            Index
        },
        data() {
            return {
                'loading': false,
                'form': this.$form.createForm(this),
                'installInfo': {
                    'mysqlHost': '',
                    'mysqlDatabase': '',
                    'mysqlUsername': '',
                    'mysqlPassword': '',
                    'mysqlPrefix': '',
                    'mysqlHostport': '',
                    'initData': false
                }
            };
        },
        created() {
            this.checkInstall();
        },
        mounted() {
            setTimeout(() => {
                this.form = this.$form.createForm(this);
            }, 500);
        },
        'methods': {
            handleSubmit() {
                const app = this;
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            app.installInfo = values;
                            app.install();
                        }
                    }
                );
            },
            install() {
                this.loading = true;
                this.installInfo.initData = this.installInfo.initData ? 1 : 0;
                install(this.installInfo).then(res => {
                    this.loading = false;
                    if (!checkResponse(res)) {
                        return false;
                    }
                    this.$router.push({'name': 'login'});
                })['catch'](() => {
                    this.loading = false;
                });
            },
            checkInstall() {
                checkInstall().then(res => {
                    if (checkResponse(res)) {
                        this.$router.push({'name': 'login'});
                    }
                });
            }
        }
    };
</script>
