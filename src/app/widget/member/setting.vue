<template>
    <div class="member-setting">
        <div class="layout-item left">
            <div class="left-content">
                <div class="search-type">
                    <a-menu :selectedKeys="keys" @click="menuClick" mode="inline">
                        <a-menu-item key="base">
                            <span>基本设置</span>
                        </a-menu-item>
                        <a-menu-item key="security">
                            <span>安全设置</span>
                        </a-menu-item>
                        <!-- <a-menu-item key="binding">
                             <span>账号绑定</span>
                         </a-menu-item>
                         <a-menu-item key="notification">
                             <span>新消息通知</span>
                         </a-menu-item>-->
                    </a-menu>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        'name': 'member',
        'props': {
            'keys': {
                'type': Array,
                'default': function () {
                    return ['base'];
                }
            }
        },
        'methods': {
            menuClick(event) {
                const key = event.key;
                let url = '';
                switch (key) {
                    case 'base':
                        url = '/member/base';
                        break;
                    case 'security':
                        url = '/member/security';
                }
                this.$router.push(url);
            }
        }
    };
</script>

<style lang="less">
    .member-setting {
        .left {
            height: 100%;
            width: 225px;
            border-right: 1px solid #e8e8e8;

            .ant-menu-root {
                border-right: none;
            }
        }
    }
</style>
