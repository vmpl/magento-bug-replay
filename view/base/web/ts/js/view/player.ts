import Component from 'uiComponent';
import Data from "VMPL_BugReplay/js/model/data";

declare var rrwebPlayer: any;

export default Component.extend({
    afterRender(element: HTMLDivElement) {
        if (!this.element) {
            this.element = element;
        }

        Data.events.subscribe(() => {
            while (this.element.lastElementChild) {
                this.element.removeChild(this.element.lastElementChild);
            }

            const events = Data.events();
            console.log(events)
            this.player = new rrwebPlayer({
                target: this.element,
                props: {
                    events,
                }
            })
        })
    }
});
