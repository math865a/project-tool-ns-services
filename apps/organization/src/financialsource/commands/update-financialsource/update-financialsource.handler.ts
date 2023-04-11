import { FinancialSourceUpdatedEvent } from '@ns/events';
import {
    ValidateFinancialSourceNameQueryHandler,
    ValidateFinancialSourceNameQuery,
} from '../../queries';
import { Neo4jClient } from '@ns/neo4j';
import { NatsPublisher } from '@ns/nats';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { FormErrorResponse, FormResponse, FormSuccessResponse } from '@ns/definitions';
import { UpdateFinancialSourceCommand } from './update-financialsource-details.command';

@CommandHandler(UpdateFinancialSourceCommand)
export class UpdateFinancialSourceHandler
    implements ICommandHandler<UpdateFinancialSourceCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly ValidateName: ValidateFinancialSourceNameQueryHandler,
        private readonly publisher: NatsPublisher,
    ) {}

    async execute(
        command: UpdateFinancialSourceCommand,
    ): Promise<FormResponse> {
        const exists = await this.ValidateName.execute(
            new ValidateFinancialSourceNameQuery(command.dto.name),
        );
        if (exists) {
            return new FormErrorResponse({
                validation: {
                    name: 'Der eksisterer allerede en finanskilde med dette navn.',
                },
            });
        }

        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new FinancialSourceUpdatedEvent());
            return new FormSuccessResponse({message: "Finanskilden blev opdateret"});
        }
        return new FormErrorResponse({message: "Der skete en fejl."});
    }

    query = `
        MATCH (f:FinancialSource)
            WHERE f.id = $financialSourceId
        SET f += {
            name: $name
        }
        RETURN {} AS result
   `;
}
