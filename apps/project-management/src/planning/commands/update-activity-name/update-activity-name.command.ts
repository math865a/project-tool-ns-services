import {
    UpdateActivityNameDto
} from '@ns/dto';

export class UpdateActivityNameCommand {
    constructor(public readonly dto: UpdateActivityNameDto) {}
}
