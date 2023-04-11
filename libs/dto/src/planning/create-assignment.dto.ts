import { CreateAllocationDto } from "./create-allocation.dto";

export class CreateAssignmentDto {
    public readonly id: string;
    public readonly agentId: string;
    public readonly taskId: string;
    public readonly allocations: CreateAllocationDto[];
}
