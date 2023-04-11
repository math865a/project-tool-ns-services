function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "resourcetype";

export const resourceTypePatterns = {
    createResourceType: getPattern("create"),
    deleteResourceType: getPattern("delete"),
    updateResourceType: getPattern("update"),
    getResourceTypeProfile: getPattern("get:profile"),
    getResourceTypeOptions: getPattern("get:options"),
    getResourceTypesView: getPattern("get:view"),
};
