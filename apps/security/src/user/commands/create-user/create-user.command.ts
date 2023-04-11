import { CreateUserDto } from "@ns/dto";

export class CreateUserCommand {
    constructor(
        public readonly dto: CreateUserDto,
        public readonly uid: string
    ) {}
}
