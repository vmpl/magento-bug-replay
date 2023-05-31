import Component from 'uiComponent';

export default Component.extend({
    defaults: {
        template: 'VMPL_BugReplay/player/list/item',
        // @bug for some reason it doesn't get set to the component, yet links works properly
        // exports: {
        //     onItemClick: '${ $.provider }:onItemClick'
        // },
        // links: {
        //     idActive: '${ $.provider }:idActive',
        // },
    }
});
