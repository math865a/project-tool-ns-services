import { UpdateResourceDto } from "@ns/dto";


export class UpdateResourceCommand {
  constructor(
    public readonly dto: UpdateResourceDto,
    public readonly uid: string,
  ) {}
}

