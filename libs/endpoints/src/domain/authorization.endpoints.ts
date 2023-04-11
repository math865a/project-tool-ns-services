function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'authorization';

export const authorizationPatterns = {
    getAbilities: getPattern('get:abilities'),
};
