import log from 'loglevel';

log.setLevel('info');

// Example: make info logs cyan and add a prefix
log.methodFactory = function (methodName) {
    const rawMethod = (console as any)[methodName] || console.log;
    return function (...args: any[]) {
        if (methodName === 'info') {
            rawMethod(`\x1b[32m[INFO]\x1b[0m`, ...args); // Green
        } else if (methodName === 'warn') {
            rawMethod(`\x1b[33m[WARN]\x1b[0m`, ...args); // Yellow
        } else if (methodName === 'error') {
            rawMethod(`\x1b[31m[ERROR]\x1b[0m`, ...args); // Red
        } else {
            rawMethod(`[${methodName.toUpperCase()}]`, ...args);
        }
    };
};
log.setLevel(log.getLevel());

export default log;
