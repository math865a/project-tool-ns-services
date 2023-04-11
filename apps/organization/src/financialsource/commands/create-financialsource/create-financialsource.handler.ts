import { FinancialSourceCreatedEvent } from "@ns/events";
import {
    ValidateFinancialSourceNameQuery,
    ValidateFinancialSourceNameQueryHandler,
} from "../../queries";
import { Neo4jClient } from "@ns/neo4j";
import { NatsPublisher } from "@ns/nats";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CreateFinancialSourceCommand } from "./create-financialsource.command";

@CommandHandler(CreateFinancialSourceCommand)
export class CreateFinancialSourceHandler
    implements ICommandHandler<CreateFinancialSourceCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly ValidateName: ValidateFinancialSourceNameQueryHandler,
        private readonly publisher: NatsPublisher
    ) {}

    async execute(
        command: CreateFinancialSourceCommand
    ): Promise<FormResponse> {
        const exists = await this.ValidateName.execute(
            new ValidateFinancialSourceNameQuery(command.dto.name)
        );
        if (exists) {
            return new FormErrorResponse({
                validation: {
                    name: "Der eksisterer allerede en finanskilde med dette navn.",
                },
            });
        }
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        this.publisher.publish(new FinancialSourceCreatedEvent());
        return new FormSuccessResponse({
            id: queryResult.records[0].get("id"),
        });
    }

    query = `
        MATCH (u:User {uid: $uid})
        CREATE (f:FinancialSource {
            id: apoc.create.uuid(),
            name: $name
        })
        MERGE (f)-[r:CREATED_BY {timestamp: datetime()}]->(u)
        RETURN f.id AS id
   `;
}
