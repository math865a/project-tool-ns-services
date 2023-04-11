function getPattern(action: string) {
    return `${service}.${action}`;
}
const service = "capacity-board";
export const capacityBoardPatterns = {
    getRows: getPattern("get:rows"),
    getBatch: getPattern("get:batch"),
};
