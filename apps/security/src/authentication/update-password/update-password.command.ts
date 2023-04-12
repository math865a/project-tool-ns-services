import { UpdatePasswordDto } from "@ns/dto";


export class UpdatePasswordCommand {
    constructor(
        public readonly dto: UpdatePasswordDto,
        public readonly uid: string
    ) {}
}

