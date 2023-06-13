import Component from 'uiComponent';

export default Component.extend({
    defaults: {
        template: 'VMPL_BugReplay/player/list/item/option',
        itemProvider: "${ $.parentName.split('.').slice(0, -1).join('.') }",
        provider: "${ $.parentName.split('.').slice(0, -2).join('.') }",
        imports: {
            item: '${ $.itemProvider }:item',
        },
    },
});
