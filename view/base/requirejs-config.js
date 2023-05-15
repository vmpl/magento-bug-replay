var config = {
    map: {
        '*': {
            'dexie': 'VMPL_BugReplay/js/lib/dexie',
            'dexie-export-import': 'VMPL_BugReplay/js/lib/dexie-export-import',
            'rrweb': 'VMPL_BugReplay/js/lib/rrweb',
        }
    },
    worker: {
        ignore: {
            'jquery': true,
            'knockoutjs/knockout-fast-foreach': true,
        }
    }
};
