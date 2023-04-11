import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateCredentialsCommand } from "./create-credentials.command";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import {
    CredentialsCreatedEvent,
    CredentialsCreationFailedEvent,
} from "@ns/events";
import { generatePassword } from "@ns/util";

@CommandHandler(CreateCredentialsCommand)
export class CreateCredentialsHandler
    implements ICommandHandler<CreateCredentialsCommand>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: CreateCredentialsCommand): Promise<void> {
        const password = generatePassword();
        const queryResult = await this.client.write(this.query, {
            uid: command.uid,
            email: command.email,
            password: password,
        });
        if (queryResult.summary.updateStatistics.containsSystemUpdates()) {
            this.publisher.publish(new CredentialsCreatedEvent(command.uid, command.sendWelcomeEmail));
        } else {
            this.publisher.publish(
                new CredentialsCreationFailedEvent(command.uid)
            );
        }
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid
        CREATE (cred:Credentials {
            id: apoc.create.uuid(),
            username: $email,
            password: $password
        })
        MERGE (u)-[:HAS_CREDENTIALS]->(cred)
    `;
}
