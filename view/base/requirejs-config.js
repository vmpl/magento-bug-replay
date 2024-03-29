var config = {
    config: {
        mixins: {
            'mage/utils/objects': {
                'VMPL_BugReplay/js/mage/utils/objects-mixin': true,
            },
        },
    },
    map: {
        '*': {
            'dexie': 'VMPL_BugReplay/js/lib/dexie',
            'dexie-export-import': 'VMPL_BugReplay/js/lib/dexie-export-import',
            'rrweb-player': 'VMPL_BugReplay/rrweb-player/index',
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
