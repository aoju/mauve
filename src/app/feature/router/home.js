export default [{
    //任务看板
    'name': 'task',
    'path': '/project/space/task/:code',
    'component': resolve => require(['../../widget/project/space/task'], resolve),
    'meta': {'model': '122', 'info': {'show_slider': false}},
    'children': [{
        //任务详情
        'name': 'taskdetail',
        'path': 'detail/:taskCode',
        'component': resolve => require(['../../widget/project/space/taskdetail'], resolve),
        'meta': {'model': 'Project', 'info': {'show_slider': false}}
    }]
}, {
    //邀请链接
    'name': 'inviteFromLink',
    'path': '/invite_from_link/:code',
    'component': resolve => require(['../../widget/common/invite'], resolve),
    'meta': {'model': 'Common', 'info': {'show_slider': false}}
}
];
