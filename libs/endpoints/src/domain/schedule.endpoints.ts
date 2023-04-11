function getPattern(action: string) {
    return `${service}.${action}`;
}

const service = "schedule";

export const schedulePatterns = {
    getTasks: getPattern("get:tasks"),
    getSchedule: getPattern("get:schedule"),
    getSummaryTasks: getPattern("get:summary-tasks"),
    getBookingStageTimeseries: getPattern("get:booking-stage-timeseries"),
    getCapacityDifferenceTimeseries: getPattern(
        "get:capacity-difference-timeseries"
    ),
    getWorkpackageTasks: getPattern("get:workpackage-tasks"),
    getWorkpackageTimeseries: getPattern("get:workpackage-timeseries"),
    getWorkpackageTotals: getPattern("get:workpackage-totals")
};
