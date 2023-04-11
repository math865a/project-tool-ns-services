function getPattern(action: string) {
    return `${service}.${action}`;
}
const service = "user";
export const userPatterns = {
    getUser: getPattern("get"),
    getUsersView: getPattern("get:view"),
    getUserOptions: getPattern("get:options"),
    getResourceProfileUserOptions: getPattern("get:resource-options"),
    createUser: getPattern("create"),
    updateUser: getPattern("update"),
    updateUserDetails: getPattern("update:details"),
    deleteUser: getPattern("delete"),
    deactivateUser: getPattern("deactivate"),
    activateUser: getPattern("activate"),
    getUserConnectOptions: getPattern("get:user-connect-options"),
    linkUser: getPattern("link"),
    splitUser: getPattern("split"),
};
