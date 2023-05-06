var config = {
    map: {
        '*': {
            'threads': 'VMPL_BugReplay/js/lib/threads',
            'threads/worker': 'VMPL_BugReplay/js/lib/threads/worker',
            'dexie': 'VMPL_BugReplay/js/lib/dexie',
            'jsdom': 'VMPL_BugReplay/js/lib/jsdom',
        }
    },
    worker: {
        ignore: {
            'jquery': true,
            'knockoutjs/knockout-fast-foreach': true,
        }
    }
};
