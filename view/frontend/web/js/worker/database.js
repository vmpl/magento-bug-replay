const db = (() => {
    return fetch('/vmpl-bug-report/config/worker')
        .then(result => result.json())
        .then(response => {
            importScripts(...Object.values(response.assetUrl))
        })
        .then(() => {
            const db = new Dexie("VM.PL-RecorderData");
            db.version(1).stores({
                events: "timestamp,type,data"
            });

            return db;
        })

})();

onmessage = (event) => {
    switch (event.data.type) {
        case 'add':
            const recordEvent = event.data.event;
            db.then(it => {
                it.events.add(recordEvent);
            })
            break;
        case 'all':
            db.then(it => {
                it.events.toArray()
                    .then(events => {
                        postMessage({type: 'all', events})
                    })
            });
            break;
        default:
            console.log('default type worker message', event.data);
            break;
    }
}
