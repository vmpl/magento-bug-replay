import Component from 'uiComponent';
import Data from "VMPL_BugReplay/js/model/data";

declare var rrwebPlayer: any;

export default Component.extend({
    afterRender(element: HTMLDivElement) {
        if (!this.element) {
            this.element = element;
            window.addEventListener(
                'resize',
                this.bindPlayer.bind(this),
                {passive: true},
            )
        }

        Data.events.subscribe(this.bindPlayer.bind(this))
    },
    bindPlayer() {
        while (this.element.lastElementChild) {
            this.element.removeChild(this.element.lastElementChild);
        }

        const width = this.element.clientWidth;
        const height = width * 656 / 1024;
        const events = Data.events();

        this.player = new rrwebPlayer({
            target: this.element,
            props: {
                events,
                width,
                height,
            }
        })
    }
});
