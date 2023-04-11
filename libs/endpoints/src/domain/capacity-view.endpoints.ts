function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "capacity-view";

export const capacityViewPatterns = {
    getCapacityViews: getPattern("get"),
    createCapacityView: getPattern("create"),
    updateCapacityView: getPattern("update"),
    updateCapacityViewName: getPattern("update:name"),
    updateDefaultCapacityView: getPattern("update:default"),
    deleteCapacityView: getPattern("delete"),
};
