
export class CreateAllocationDto {
    public readonly id: string;
    public readonly startDate: string;
    public readonly endDate: string;
    public readonly defaultMinutes: number;
    public readonly overtimeMinutes: number;
    public readonly taskId: string;
    public readonly agentId: string;
}
