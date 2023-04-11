import { IQuery } from "@nestjs/cqrs";

export class TeamOptionsQuery implements IQuery {
   constructor(public readonly workpackageId: string){}
};
