import { DeleteAssignmentDto } from "@ns/dto";

export class DeleteAssignmentCommand {
  constructor(
    public readonly dto: DeleteAssignmentDto,
    public readonly uid: string
  ) {}
}
