<template>
    <div v-if="currentOrganization">
        <a-dropdown class="action-item" placement="bottomCenter">
            <div class="organization-select">
                <span>{{currentOrganization.name}}</span>
                <span><a-icon type="down"/></span>
            </div>
            <a-menu :selectable="false" @click="organizationAction" class="middle-menu organization-menu"
                    slot="overlay">
                <a-menu-item :key="index" v-for="(organization,index) in organizationList">
                    <a href="javascript:;">{{organization.name}}</a>
                </a-menu-item>
            </a-menu>
        </a-dropdown>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import {changeCurrentOrganization} from '../../feature/restapi/api.member';
    import {createRoute ,checkResponse} from '../../../assets/js/utils';

    export default {
        'name': 'Choice',
        data() {
            return {};
        },
        'computed': {
            ...mapState({
                'currentOrganization': state => state.currentOrganization,
                'organizationList': state => state.organizationList
            })
        },
        'methods': {
            organizationAction(action) {
                let app = this;
                app.$store.dispatch('setCurrentOrganization', app.organizationList[action.key]);
                changeCurrentOrganization(app.organizationList[action.key].code).then(res => {
                    if (checkResponse(res)) {
                        app.$store.dispatch('SET_MENU', res.data.menuList);
                        app.$store.dispatch('SET_USER', res.data.member);
                        app.$store.dispatch('windowLoading', true);
                        setTimeout(function () {
                            const menu = res.data.menuList;
                            if (menu) {
                                let routes = app.$router.options.routes;
                                menu.forEach(function (v) {
                                    routes[0].children.push(createRoute(v));
                                    if (v.children) {
                                        v.children.forEach(function (v2) {
                                            routes[0].children.push(createRoute(v2));
                                            if (v2.children) {
                                                v2.children.forEach(function (v3) {
                                                    routes[0].children.push(createRoute(v3));
                                                });
                                            }
                                        });
                                    }
                                });
                                app.$router.addRoutes(routes);
                                app.$store.dispatch('windowLoading', false);
                                app.$router.replace('/');
                            }
                        }, 500);
                    }
                });
            }
        }
    };

</script>
