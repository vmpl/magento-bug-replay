## Adobe Commerce (Magento 2) Bug Replay by VM.PL

[![Latest Version](https://img.shields.io/github/v/tag/vmpl/magento-bug-replay?sort=semver&label=version)](https://github.com/vmpl/magento-bug-replay/tree/1.1.1-alpha)
[![Development Branch](https://img.shields.io/badge/development_branch-develop-green.svg)](https://github.com/vmpl/magento-bug-replay/tree/develop/)
[![License](https://img.shields.io/badge/license-Apache2.0-blue.svg)](https://github.com/vmpl/magento-bug-replay/blob/master/LICENSE)

### Features Stack

1. Record user interaction of webpage
2. Most of work is seperated to dedicated web-worker for parallel not blocking thread
3. Using local browser database for storing recorded events data
4. Sending chosen session from storefront to admin site to report error issues
5. Automatically records console events and optionally send it to administration 
6. Store configuration for automated recording and reporting of web session errors
7. Free to use 🔥

### Reference Links

* [VMPL Company Page](https://vm.pl/)
* [Group on Github](https://github.com/orgs/vmpl/teams/magento/)
* [Demo Page](https://demo-magento.vm.pl/)
* [rrweb](https://www.rrweb.io)

## Quick Installation

```shell
$ composer require vmpl/module-bug-replay
```
```shell
$ bin/magento module:enable VMPL_BugReplay
```
