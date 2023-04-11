function getPattern(action: string) {
    return `${service}.${action}`;
}
const service = "calendar";
export const calendarPatterns = {
    getCalendarOptions: getPattern("get:options"),
    getDefaultCalendar: getPattern("get:default"),
};
