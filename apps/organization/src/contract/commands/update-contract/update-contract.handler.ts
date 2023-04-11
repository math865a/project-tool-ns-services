import { ContractUpdatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { NatsPublisher } from "@ns/nats";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { UpdateContractCommand } from "./update-contract.command";
import { ValidateContractHandler, ValidateContractQuery } from "../../queries";

@CommandHandler(UpdateContractCommand)
export class UpdateContractHandler
    implements ICommandHandler<UpdateContractCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly validate: ValidateContractHandler,
        private readonly publisher: NatsPublisher
    ) {}

    async execute(command: UpdateContractCommand): Promise<FormResponse> {
        const isValid = await this.validate.execute(
            new ValidateContractQuery(
                command.dto.name,
                command.dto.abbrevation,
                command.dto.contractId
            )
        );
        if (!isValid) {
            return new FormErrorResponse({
                message:
                    "En kontrakt med samme navn eller forkortelse eksisterer allerede",
            });
        }

        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new ContractUpdatedEvent());
            return new FormSuccessResponse({
                message: "Kontrakten blev opdateret.",
            });
        }
        return new FormErrorResponse({ message: "Noget gik galt." });
    }

    query = `
        MATCH (c:Contract)
            WHERE c.id = $contractId
        SET c += {
            name: $name,
            abbrevation: $abbrevation
        }
        RETURN {} AS result
   `;
}
