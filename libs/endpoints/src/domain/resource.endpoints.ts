function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "resource";

export const resourcePatterns = {
    createResource: getPattern("create"),
    deleteResource: getPattern("delete"),
    updateResource: getPattern("update"),
    getResourceProfile: getPattern("get:profile"),
    getResourcesView: getPattern("get:view"),
    getResourceOptions: getPattern("get:options")
};
