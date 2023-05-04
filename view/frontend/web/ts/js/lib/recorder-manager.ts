export default class RecorderManager {
    constructor(private message: string) {
    }

    logMessage(): void  {
        console.log(this.message);
    }
}
