/*eslint-disable */
/* jscs:disable */
define(["VMPL_BugReplay/js/model/data"], function (_data) {
  function _default(session) {
    return _data.manager.then(function (manager) {
      return manager.getEventsForSessionAt([session]);
    }).then(function (events) {
      _data.events(events);
    });
  }
  return _default;
});
//# sourceMappingURL=session-replay.js.map