import $http from '../../shared/http';
import {getFullUrl} from '../../shared/utils';

export function dingTalkOauth() {
    return getFullUrl('index/oauth/dingTalkOauth');
}

export function dingTalkLoginByCode(data) {
    return $http.post('index/oauth/dingTalkLoginByCode', data);
}
