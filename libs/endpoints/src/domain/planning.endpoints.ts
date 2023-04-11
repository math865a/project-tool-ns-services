

function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'planning';

export const planningPatterns = {
    getPlan: getPattern('get:plan'),
    getAllocation: getPattern('get:allocation'),
    createActivity: getPattern('create:activity'),
    deleteActivity: getPattern('delete:activity'),
    createAllocation: getPattern('create:allocation'),
    updateAllocation: getPattern('update:allocation'),
    createAssignment: getPattern('create:assignment'),
    deleteAssignment: getPattern('delete:assignment'),
    updatePeriod: getPattern('update:period'),
    updateActivityColor: getPattern('update:activity-color'),
    updateActivityName: getPattern('update:activity-name'),
};
