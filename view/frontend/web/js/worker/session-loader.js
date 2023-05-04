(async () => {
    const content = await fetch('/vmpl-bug-report/config/worker')
        .then(response => response.json())
    require = {
        baseUrl: content.baseUrl,
    }
    importScripts(
        content.assetUrl.requirejs,
        content.assetUrl.requireMixins,
        content.assetUrl.requireWorker,
        content.assetUrl.requireConfig,
    )

    require(['VMPL_BugReplay/js/worker/session-worker'])
})()
