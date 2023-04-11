
export class DeleteAgentCommand {
  constructor(
    public readonly agentId: string,
    public readonly uid: string
  ) {}
}

