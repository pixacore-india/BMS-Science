const { URL, URLSearchParams } = require('@lvchengbin/url');

let UTILITY = {
    getQueryString: function (url, key) {
        if (!url) url = window.location.href;
        key = key.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + key + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },

    updateQueryString: function (uri, key, value) {
        const re = new RegExp("([?&])" + key + "=.*?(&|#|$)", "i");
        let newUri = uri;
        if (uri.match(re)) {
            newUri = uri.replace(re, '$1' + key + "=" + value + '$2');
        } else {
            let hash = '';
            if (uri.indexOf('#') !== -1) {
                hash = uri.replace(/.*#/, '#');
                uri = uri.replace(/#.*/, '');
            }
            const separator = uri.indexOf('?') !== -1 ? "&" : "?";
            newUri = uri + separator + key + "=" + value;
        }
        if (key === 'posts_per_page') {
            return newUri;
        }
        history.pushState({}, null, newUri);
    }
};

module.exports = UTILITY;
