export class UpdateAllocationDto {
    public readonly allocationId: string;
    public readonly agentId: string;
    public readonly startDate: string;
    public readonly endDate: string;
    public readonly defaultMinutes: number;
    public readonly overtimeMinutes: number;
}
