import Provider from "VMPL_BugReplay/js/model/provider";
import RecorderManager from "VMPL_BugReplay/js/lib/recorder-manager";

export default Provider.extend({
    defaults: {
        fileHash: 'AdminReplay',
        fileRequestUrl: '',
    },
    _manager() {
        const endpoint = new URL(this.endpointRequest).pathname.replace(/\/+$/, '');

        if (this.fileHash === 'AdminReplay') {
            return RecorderManager.init(endpoint, this.fileHash); // @bug for some reason _super() doesn't work ??
        }

        return indexedDB.databases()
            .then(databases => {
                if (databases.some(it => it.name === this.fileHash)) {
                    return RecorderManager.init(endpoint, this.fileHash);
                }

                return RecorderManager.init(endpoint, this.fileHash)
                    .then((manager: RecorderManager) => {
                        return manager.downloadImport(new URL(this.fileRequestUrl));
                    })
            })
    },
});
