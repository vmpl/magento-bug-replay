var config = {
    map: {
        '*': {
            'threads': 'VMPL_BugReplay/js/lib/threads',
            'threads/worker': 'VMPL_BugReplay/js/lib/threads/worker',
            'dexie': 'VMPL_BugReplay/js/lib/dexie',
            'rrweb': 'VMPL_BugReplay/js/lib/rrweb'
        }
    },
    worker: {
        ignore: {
            'jquery': true,
            'knockoutjs/knockout-fast-foreach': true,
        }
    }
};
