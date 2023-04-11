import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UpdateResourceTypeCommand } from "./update-resourcetype.command";
import { ResourcetypeUpdatedEvent } from "@ns/events";

@CommandHandler(UpdateResourceTypeCommand)
export class UpdateResourceTypeHandler
    implements ICommandHandler<UpdateResourceTypeCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateResourceTypeCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        const result = queryResult.records[0].get("result");
        this.publisher.publish(new ResourcetypeUpdatedEvent());
        return new FormSuccessResponse({
            message: "Detaljerne blev opdateret.",
        });
    }

    query = `
        MATCH (rt:ResourceType)
            WHERE rt.id = $resourceTypeId
        SET rt += {
            name: $name,
            abbrevation: $abbrevation,
            typeNo: $typeNo,
            salesDefault: $salesDefault,
            salesOvertime: $salesOvertime
        }
        RETURN {} AS result
   `;
}
