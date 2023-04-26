importScripts('../lib/dexie.min.mjs');

const db = new Dexie("WorkerDatabase");
db.version(1).stores({
    events: "name"
});

onmessage = (event) => {
    console.log('Message received')
    postMessage('Hello World')
}
