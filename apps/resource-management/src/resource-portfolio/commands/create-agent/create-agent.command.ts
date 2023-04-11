import { CreateAgentDto } from '@ns/dto';

export class CreateAgentCommand {
  constructor(
    public readonly dto: CreateAgentDto,
    public readonly uid: string,
  ) {}
}

