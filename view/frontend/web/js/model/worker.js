define(function (require, exports, module) {
    const url = new URL(module.uri);
    let pathname = url.pathname.split('/');
    pathname.pop();
    pathname.pop();
    pathname.push('worker', 'database.js');
    url.pathname = pathname.join('/');

    return new Worker(url.toString());
})
