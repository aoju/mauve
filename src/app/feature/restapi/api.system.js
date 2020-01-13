import $http from '../../shared/http';

export function info() {
    return $http.post('project/index/systemConfig');
}
