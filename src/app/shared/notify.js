import {message, notification} from 'ant-design-vue';

export const showMsgNotification = (title, msg, $opt = {}) => {
    let options = {
        'body': msg,
        'icon': $opt.icon || '/img/preview.jpg',
        'showTime': $opt.showTime || 15000,
        'onclick': $opt.onclick,
        'onshow': $opt.onshow,
        'onerror': $opt.onerror,
        'onclose': $opt.onclose
    };
    let Notification = window.Notification || window.mozNotification || window.webkitNotification;
    if (Notification && Notification.permission === 'granted') {
        let instance = new Notification(title, options);
        instance.onclick = function () {
            // Something to do
            if (typeof options.onclick === 'function') {
                options.onclick(instance);
            }
            // window.location.href = instance.icon
        };
        instance.onerror = function () {
            // Something to do
            if (typeof options.onerror === 'function') {
                options.onerror(instance);
            }
        };
        instance.onshow = function () {
            // Something to do
            if (typeof options.onshow === 'function') {
                options.onshow(instance);
            }
            setTimeout(function () {
                instance.close();
            }, options.showTime);
        };
        instance.onclose = function () {
            // Something to do
            if (typeof options.onclose === 'function') {
                options.onclose(instance);
            }
        };
    } else if (Notification && Notification.permission !== 'denied') {
        Notification.requestPermission(function (status) {
            if (Notification.permission !== status) {
                Notification.permission = status;
            }
            // If the user said okay
            if (status === 'granted') {
                let instance = new Notification(title, options);
                instance.onclick = function () {
                    // Something to do
                    if (typeof options.onclick === 'function') {
                        options.onclick(instance);
                    }
                };
                instance.onerror = function () {
                    // Something to do
                    if (typeof options.onerror === 'function') {
                        options.onerror(instance);
                    }
                };
                instance.onshow = function () {
                    // Something to do
                    if (typeof options.onshow === 'function') {
                        options.onshow(instance);
                    }
                    setTimeout(function () {
                        instance.close();
                    }, options.showTime);
                };
                instance.onclose = function () {
                    // Something to do
                    if (typeof options.onclose === 'function') {
                        options.onclose(instance);
                    }
                };
            } else {
                return false;
            }
        });
    } else {
        return false;
    }
};

export const notice = (content, type = 'message', action = 'warning', duration = 3, placement = 'bottomLeft') => {
    destroyNotice();
    let config = {};
    config.duration = duration;
    if (type === 'message') {
        switch (action) {
            case 'info':
                return message.info(content, duration);
            case 'success':
                return message.success(content, duration);
            case 'error':
                return message.error(content, duration);
            case 'loading':
                return message.loading(content, duration);
            default:
                return message.warning(content, duration);
        }
    } else {
        config.message = content.title;
        config.description = content.msg || '';
        config.placement = placement;
        switch (action) {
            case 'open':
                return notification.open(config);
            case 'info':
                return notification.info(config);
            case 'success':
                return notification.success(config);
            case 'error':
                return notification.error(config);
            default:
                return notification.warning(config);
        }
    }
};
export const destroyNotice = (type = '') => {
    if (!type) {
        message.destroy();
        notification.destroy();
    } else {
        type === 'message' ? message.destroy() : notification.destroy();
    }
};

