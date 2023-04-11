function getPattern(action: string) {
    return `${service}.${action}`;
}
const service = "access-group";
export const accessGroupPatterns = {
    createAccessGroup: getPattern("create"),
    deleteAccessGroup: getPattern("delete"),
    updateAccessGroup: getPattern("update"),
    getAccessGroupsView: getPattern("get:view"),
    getAccessGroupOptions: getPattern("get:options"),
};
