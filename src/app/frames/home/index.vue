<template>
    <div class="form-body">
        <div class="row">
            <div class="img-holder">
                <div class="bg"></div>
                <div class="info-holder">
                    <h3>协作，让企业和团队实现目标</h3>
                    <p>一切工作都可以从这里开始。无论是策划活动、研发软件、制造机器人、建设发电站或者发射卫星，团队成员以更高效的协作方式，围绕目标不断创造成果。</p>
                    <img src="../../../assets/image/graphic.svg">
                </div>
            </div>
            <div class="form-holder">
                <div class="form-content">
                    <div class="form-items">
                        <div class="website-logo-inside">
                            <a href="#">
                                <div class="logo">
                                    <img class="logo-size" src=../../../assets/image/logo.png alt="">
                                    <span class="title">Team Work</span>
                                </div>
                            </a>
                        </div>
                        <router-view/>
                        <slot></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        'name': 'Index',
        'props': {
            'desc': {
                'type': [String],
                default() {
                    return '欢迎使用项目管理系统';
                }
            }
        }
    };
</script>

<style lang="less">
    @import "../../../assets/css/index";
</style>
