import { ToggleActiveStatusDto } from "@ns/dto";

export class ToggleActiveStatusCommand {
    constructor(public readonly dto: ToggleActiveStatusDto, public readonly uid: string){}
}