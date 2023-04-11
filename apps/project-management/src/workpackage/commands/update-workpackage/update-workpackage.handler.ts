import { WorkpackageUpdatedEvent } from "@ns/events";
import {
    ValidateSystematicNameQuery,
    ValidateSystematicNameQueryHandler,
} from "../../queries";
import { Neo4jClient } from "@ns/neo4j";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateWorkpackageCommand } from "./update-workpackage.command";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";

@CommandHandler(UpdateWorkpackageCommand)
export class UpdateWorkpackageHandler
    implements ICommandHandler<UpdateWorkpackageCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly validate: ValidateSystematicNameQueryHandler,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdateWorkpackageCommand): Promise<FormResponse> {
        const systematicName = await this.validate.execute(
            new ValidateSystematicNameQuery(
                command.dto.contractId,
                command.dto.financialSourceId,
                command.dto.serialNo
            )
        );
        if (systematicName instanceof FormErrorResponse) {
            return systematicName;
        }

        const result = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (result.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new WorkpackageUpdatedEvent());
            return new FormSuccessResponse({
                message: "Arbejdspakkens blev opdateret.",
            });
        }
        return new FormErrorResponse({
            message: "Arbejdspakkens blev ikke opdateret.",
        });
    }

    query = `
        MATCH (w:Workpackage)
            WHERE w.id = $workpackageId
        SET w += {
            name: $name,
            description: $description,
            serialNo: $serialNo,
            systematicName: $systematicName
        }
        WITH w

        CALL {
            WITH w
            MATCH (w)-[rel]-(:Contract)
            MATCH (c:Contract)
                WHERE c.id = $contractId

            CALL apoc.refactor.to(rel, c)
            YIELD output
            RETURN output
        }
        
        CALL {
            WITH w
            MATCH (f)-[rel]-(:FinancialSource)
            MATCH (f:FinancialSource)
                WHERE f.id = $financialSourceId
            CALL apoc.refactor.to(rel, f)
            YIELD output
            RETURN output as output1
        }

        RETURN {} AS result
   `;
}
