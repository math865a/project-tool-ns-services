function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "authentication";

export const authenticationPatterns = {
    updatePassword: getPattern("update:password"),
    resetPassword: getPattern("reset:password"),
    validateCredentials: getPattern("validate:credentials"),
};
