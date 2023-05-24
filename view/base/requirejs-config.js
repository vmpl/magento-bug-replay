var config = {
    map: {
        '*': {
            'dexie': 'VMPL_BugReplay/js/lib/dexie',
            'dexie-export-import': 'VMPL_BugReplay/js/lib/dexie-export-import',
            'dexie-relationships': 'VMPL_BugReplay/js/lib/dexie-relationships',
            'rrweb': 'VMPL_BugReplay/js/lib/rrweb',
            'axios': 'VMPL_BugReplay/js/lib/axios',
            'uuid': 'VMPL_BugReplay/js/lib/uuid',
        }
    },
    worker: {
        ignore: {
            'jquery': true,
            'knockoutjs/knockout-fast-foreach': true,
        }
    }
};
