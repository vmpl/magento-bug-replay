require([
    'VMPL_BugReplay/js/model/worker',
    'domReady!',
], function (worker) {
    worker.addEventListener('message', event => {
        switch (event.data.type) {
            case 'all':
                const events = event.data.events;
                new rrwebPlayer({
                    target: document.body,
                    props: {
                        events,
                    }
                })
                break;
            default:
                console.log('default message from worker');
                break;
        }
    })

    window.demo = {
        record() {
            rrweb.record(({
                emit(event) {
                    worker.postMessage({
                        type: "add",
                        event
                    });
                }
            }))
        },
        play() {
            worker.postMessage({type: 'all'})
        }
    }
})
