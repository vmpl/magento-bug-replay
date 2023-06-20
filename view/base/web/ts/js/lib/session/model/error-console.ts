import {IErrorConsole} from "VMPL_BugReplay/js/api/session";

export default class ErrorConsole implements IErrorConsole {
    constructor(
        readonly digest: string,
        readonly message: string,
        readonly id?: number,
    ) {
    }
}
