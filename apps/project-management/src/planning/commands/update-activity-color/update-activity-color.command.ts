import {
    UpdateActivityColorDto
} from '@ns/dto';

export class UpdateActivityColorCommand {
    constructor(public readonly dto: UpdateActivityColorDto, public readonly uid: string) {}
}
