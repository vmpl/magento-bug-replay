(async () => {
    const content = await fetch('/vmpl-bug-report/session/config')
        .then(response => response.json())
    require = {
        baseUrl: content.baseUrl,
    }
    importScripts(
        content.assetUrl.requirejs,
        content.assetUrl.requireWorker,
        content.assetUrl.requireMixins,
        content.assetUrl.requireConfig,
    )

    require(['VMPL_BugReplay/js/lib/session/worker'])
})()
