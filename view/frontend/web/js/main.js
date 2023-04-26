require([
    'VMPL_BugReplay/js/model/worker',
], function (worker) {
    worker.addEventListener('message', event => {
        switch (event.data.type) {
            case 'post':
                worker.postMessage({type: 'read'});
                break;
            case 'read':
                console.log('read events', event.data.events);
                break;
            default:
                console.log('default message from worker');
                break;
        }
    })

    worker.postMessage({
        type: "post",
        events: [
            {name: 'johnny.' + Date.now()},
        ],
    });
})
