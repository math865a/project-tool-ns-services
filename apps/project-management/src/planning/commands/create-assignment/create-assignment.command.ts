import { CreateAssignmentDto } from '@ns/dto';

export class CreateAssignmentCommand {
    constructor(
        public readonly dto: CreateAssignmentDto,
        public readonly uid: string
    ) {}
}
