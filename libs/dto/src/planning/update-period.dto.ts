export class UpdatePeriodDto {
    constructor(
        public readonly activityId: string,
        public readonly startDate: string,
        public readonly endDate: string,

    ){}
}

export class PeriodUpdatedResult {
    public readonly activityId: string;
    public readonly period: {
        startDate: string;
        endDate: string;
    }
    public readonly kind: "Plan" | "Delivery" | "Task" | "Assignment" | "Allocation"
}