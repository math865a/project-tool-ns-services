function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = 'workpackages';

export const workpackagePatterns = {
    createWorkpackage: getPattern('create'),
    updateWorkpackage: getPattern('update'),
    deleteWorkpackage: getPattern('delete'),
    getWorkpackagesView: getPattern("get:view"),
    getWorkpackageProfile: getPattern("get:profile"),
    updateStage: getPattern("update:stage"),
    updateBookingStage: getPattern("update:booking-stage"),
    getWorkpackageStages: getPattern("get:stages"),
    getWorkpackageCreateForm: getPattern("get:create-form"),
    getProjectManagerWorkpackages: getPattern("get:project-manager-workpackages"),
};
