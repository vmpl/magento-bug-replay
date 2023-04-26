require([
    'VMPL_BugReplay/js/model/worker',
    'text!/vmpl-bug-report/config/worker',
], function (worker, config) {
    config = JSON.parse(config);

    worker.addEventListener('message', (event) => {
        console.log('worker send message');
    })
    worker.postMessage('Hello World!');
})
