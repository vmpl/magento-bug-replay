import Component from 'uiComponent';
import ko from 'knockout';
import RecorderManager from "VMPL_BugReplay/js/bug-replay/recorder-manager";
import {RecordEvent} from "VMPL_BugReplay/js/bug-replay/session/model/record-event";
import {IRecordSession} from "VMPL_BugReplay/js/api/session";

declare var rrwebPlayer: any;

export default Component.extend({
    events: ko.observableArray<RecordEvent>([]),
    defaults: {
        template: 'VMPL_BugReplay/player/rrweb',
        imports: {
            manager: '${ $.provider }:manager',
        },
    },
    sessionReplay(session: IRecordSession) {
        if (!session.id) {
            return Promise.resolve();
        }

        const thenManager: Promise<RecorderManager> = this.manager()
        return thenManager
            .then(manager => manager.getEventsForSessionAt([session]))
            .then(events => this.events(events))
    },
    afterRender(element: HTMLDivElement) {
        if (!this.element) {
            this.element = element;
            window.addEventListener(
                'resize',
                this.bindPlayer.bind(this),
                {passive: true},
            )
        }

        this.events.subscribe(this.bindPlayer.bind(this))
    },
    bindPlayer() {
        while (this.element.lastElementChild) {
            this.element.removeChild(this.element.lastElementChild);
        }

        const width = this.element.clientWidth;
        const height = width * 656 / 1024;
        const events = this.events();

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
