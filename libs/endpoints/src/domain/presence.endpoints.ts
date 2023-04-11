function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'presence';

export const presencePatterns = {
    registerPresence: getPattern('register:presence'),
    registerAbsence: getPattern('register:absence'),
    getPresence: getPattern("get:presence"),
    getUserPresence: getPattern("get:user-presence"),
    getIsUserOnline: getPattern("get:is-user-online"),
};
