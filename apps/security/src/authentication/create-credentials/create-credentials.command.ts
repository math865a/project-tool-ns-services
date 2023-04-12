import { CreateCredentialsDto } from "@ns/dto";

export class CreateCredentialsCommand {
    constructor(
        public readonly dto: CreateCredentialsDto,
        public readonly uid: string
    ) {}
}
