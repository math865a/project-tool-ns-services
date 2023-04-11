function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "team";

export const teamPatterns = {
    addTeamMember: getPattern("add"),
    removeTeamMember: getPattern("remove"),
    swapTeamMember: getPattern("swap"),
    getWorkpackageTeam: getPattern("get:workpackage-team"),
};
