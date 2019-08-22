import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import mutations from './mutations';
import actions from './actions';
import common from './common';
import menu from './menu';

Vue.use(Vuex);

const store = new Vuex.Store({
    'modules': {
        common,
        menu
    },
    state,
    mutations,
    actions
});
export default store;
