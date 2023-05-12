export function workerArgument(module: string) {
    return function <T extends { new(...args: any[]): {} }>(target: T) {
        return class extends target {
            $$classModule: string = `${module};${target.name}`;
        };
    }
}
