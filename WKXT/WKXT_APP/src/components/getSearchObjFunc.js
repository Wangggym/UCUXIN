export default (history, search) => {
    var qs = null
    if (search) {
        qs = search.substr(1)
    } else {
        qs = history.location.search.length > 0 ? history.location.search.substr(1) : ''
    }
    var args = {},
        items = qs.length > 0 ? qs.split('&') : [],
        item = null, name = null, value = null, i = 0, len = items.length;

    for (i = 0; i < len; i++) {
        item = items[i].split('=');
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);

        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

