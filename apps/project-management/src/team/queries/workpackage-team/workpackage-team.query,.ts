import { IQuery } from "@nestjs/cqrs";

export class WorkpackageTeamQuery implements IQuery {
    constructor(public readonly workpackageId: string) {}
}
