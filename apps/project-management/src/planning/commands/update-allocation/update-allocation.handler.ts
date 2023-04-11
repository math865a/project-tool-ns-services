import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AllocationUpdatedEvent } from "@ns/events";
import { UpdateAllocationCommand } from "./update-allocation.command";

@CommandHandler(UpdateAllocationCommand)
export class UpdateAllocationHandler
    implements ICommandHandler<UpdateAllocationCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateAllocationCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new AllocationUpdatedEvent(command.dto, command.uid));
            return new FormSuccessResponse({
                message: "Allokeringen er opdateret.",
            });
        }
        return new FormErrorResponse({
            message: "Allokeringen kunne ikke opdateres.",
        });
    }

    query = `
        MATCH (u:User {uid: $uid})
        MATCH (al:Allocation)<-[rel:IS_ASSIGNED_TO]-(:Agent)
            WHERE al.id = $allocationId

        CALL {
            WITH rel
            MATCH (a:Agent)
                WHERE a.id = $agentId
            CALL apoc.refactor.from(rel, a)
            YIELD output
            RETURN output
        }

        SET al.startDate = date($startDate),
            al.endDate = date($endDate),
            al.defaultMinutes = toInteger($defaultMinutes),
            al.overtimeMinutes = toInteger($overtimeMinutes)

    `;
}
