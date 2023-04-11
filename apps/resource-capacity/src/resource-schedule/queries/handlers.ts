import { ScheduleHandler } from "./schedule";
import { TasksHandler } from "./tasks";
import { BookingStageTimeseriesQueryHandler } from "./booking-stage-timeseries";
import { CapacityDifferenceTimeseriesQueryHandler } from "./capacity-difference-timeseries";
import { WorkpackageTasksQueryHandler } from "./workpackage-tasks";
import { WorkpackageTimeseriesQueryHandler } from "./workpackage-timeseries";
import { WorkpackageTotalsQueryHandler } from "./workpackage-totals";

export const queryHandlers = [
    ScheduleHandler,
    TasksHandler,
    BookingStageTimeseriesQueryHandler,
    CapacityDifferenceTimeseriesQueryHandler,
    WorkpackageTasksQueryHandler,
    WorkpackageTotalsQueryHandler,
    WorkpackageTimeseriesQueryHandler,
];
