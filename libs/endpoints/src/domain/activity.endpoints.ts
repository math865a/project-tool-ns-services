function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "activity";

export const activityPatterns = {
    getActivity: getPattern("get"),
    getActivityCount: getPattern("get:count")
};
