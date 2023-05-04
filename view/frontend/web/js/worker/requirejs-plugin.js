define('tryCatch', [
    'module'
], function (module) {
    let contexts = require.s.contexts,
        defContextName = '_',
        defContext = contexts[defContextName],
        originalContextOnerror = defContext.onError;

    const dispatcher = new EventTarget();
    defContext.onError = (error) => {
        const shouldContinue = dispatcher.dispatchEvent(
            new ErrorEvent('error', {error, cancelable: true})
        );
        if (shouldContinue) {
            originalContextOnerror(error);
        }
    }

    return {
        catch(handler) {
            dispatcher.addEventListener('error', handler);
        }
    };
})

require(['tryCatch'], function (tryCatch) {
    tryCatch.catch((event) => {
        if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
            console.warn(event.error);
            event.preventDefault();
        }
    })
})
