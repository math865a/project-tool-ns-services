import { EventBase } from "@ns/nats";

export class PeriodUpdatedEvent extends EventBase {
    constructor(
        public readonly body: {
            activityId: string;
            kind: "Delivery" | "Task" | "Allocation";
            fromPeriod: {
                startDate: string;
                endDate: string;
            };
            toPeriod: {
                startDate: string;
                endDate: string;
            };
        },
        public readonly uid: string
    ) {
        super()
    }
}
