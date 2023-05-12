/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/lib/worker/converter"], function (_converter) {
  function WorkerClient(scriptUrl) {
    var worker = new Worker(scriptUrl);
    return new Promise(function (resolve) {
      worker.addEventListener('message', function (event) {
        var methods = event.data.arguments;
        resolve(Object.fromEntries(methods.map(function (method) {
          return [method, function () {
            var listener = new Promise(function (resolve) {
              worker.addEventListener('message', function (event) {
                resolve(event.data);
              }, {
                once: true,
                passive: true
              });
            });
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            Promise.all(args.map(_converter.classToObject.bind(_converter))).then(function (resolved) {
              return worker.postMessage({
                method: method,
                arguments: resolved
              });
            });
            return listener;
          }];
        })));
      }, {
        once: true
      });
    });
  }
  return {
    WorkerClient: WorkerClient
  };
});
//# sourceMappingURL=client.js.map