const db = (() => {
    return fetch('/vmpl-bug-report/config/worker')
        .then(result => result.json())
        .then(response => {
            importScripts(...Object.values(response.assetUrl))
        })
        .then(() => {
            const db = new Dexie("WorkerDatabase");
            db.version(1).stores({
                events: "name"
            });

            return db;
        })

})();

onmessage = (event) => {
    switch (event.data.type) {
        case 'post':
            db.then(it => {
                it.events.bulkPut(event.data.events)
                    .then(() => {
                        postMessage({type: 'post', events: event.events});
                    })
            })
            break;
        case 'read':
            db.then(it => {
                it.events.toArray()
                    .then(events => {
                        postMessage({type: 'read', events: events});
                    })
            })
            break;
        default:
            console.log('default type worker message');
    }
}
