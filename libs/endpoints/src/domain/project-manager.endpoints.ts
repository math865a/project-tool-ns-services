function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'project-manager';

export const projectManagerPatterns = {
    getProjectManagerOptions: getPattern('get:options'),
    assignProjectManager: getPattern('assign'),
    createProjectManager: getPattern('create'),
    removeProjectManager: getPattern('remove'),
    getProjectManagers: getPattern('get:view'),
    getProjectManagerProfile: getPattern('get:profile'),
    updateProjectManager: getPattern('update'),
};
