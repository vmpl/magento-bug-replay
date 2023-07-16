# Install, update and delete guide
## Using composer
### Requirements
Current released version is in alpha stage,
[minimum-stability](https://getcomposer.org/doc/04-schema.md#minimum-stability)
has to be set on `alpha`

### Installation
1. In project root run command
```shell
$ composer require vmpl/module-bug-replay
```
2. Check if module is enabled
```shell
$ bin/magento module:enable VMPL_BugReplay
```
3. Deploy application
```shell
$ bin/magento setup:upgrade
$ bin/magento setup:di:compile
$ bin/magento setup:static-content:deploy
$ bin/magento cache:clean
```
4. After that only following files should be effected
   1. `composer.json`
   1. `composer.lock`
   1. `app/etc/config.php`

### Update
1. Run command to update only one vendor package
```shell
$ composer update vmpl/module-bug-replay
```
2. Check if version in `composer.json` match with package vendor location
3. If it doesn't remove folder in vendor contains the package, run following and check again
```shell
$ composer cc
$ composer install
```
4. Only `composer.lock` should be changed
5. Follow installation instructions after step 3.

### Remove
1. Ensure that other modules aren't depended on this one
```shell
$ bin/magento module:disable VMPL_BugReplay
```
2. Remove the package with composer command below and follow installation instructions from 3. step
```shell
$ composer remove vmpl/module-bug-replay
```
