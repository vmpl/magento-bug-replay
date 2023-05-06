window = {
    location,
}

const getDefaultContext = () => {
    return require.s.contexts['_'];
}

define('requireWorker', [], function () {
    const defaultContext = getDefaultContext(),
        originalContextOnerror = defaultContext.onError;

    const dispatcher = new EventTarget();
    defaultContext.Module = class extends defaultContext.Module {
        #ignoreModules = null;

        #getIgnoreModules() {
            if (this.#ignoreModules === null) {
                const { config } = getDefaultContext();

                this.#ignoreModules = [];
                Object.entries(config.worker.ignore).forEach(([module, shouldIgnore]) => {
                    if (shouldIgnore) {
                        this.#ignoreModules.push(module);
                    }
                })
            }

            return this.#ignoreModules ?? [];
        }

        init(depMaps, factory, errback, options) {
            if (this.#getIgnoreModules().some(it => depMaps.includes(it))) {
                this.enabled = false;
                !(options?.enabled)
                || (options.enabled = false);
            }

            super.init(depMaps, factory, this.onError.bind(this), options);
        }

        onError(error) {
            const errorCaught = !dispatcher.dispatchEvent(
                new ErrorEvent('error', {error, cancelable: true})
            );
            if (!errorCaught) {
                originalContextOnerror(error);
            }
        }
    }

    return {
        catchError(handler) {
            dispatcher.addEventListener('error', handler);
        }
    }
})

require(['requireWorker'], function (requireWorker) {
    requireWorker.catchError((event) => {
        event.preventDefault();
        console.warn(event.error?.originalError ?? event.error);
    })
})
