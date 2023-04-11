import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateUsernameCommand } from "./update-username.command";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UsernameUpdatedEvent } from "@ns/events";

@CommandHandler(UpdateUsernameCommand)
export class UpdateUsernameHandler
    implements ICommandHandler<UpdateUsernameCommand>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: UpdateUsernameCommand): Promise<void> {
        await this.client.write(this.query, {
            email: command.email,
            uid: command.uid,
        });
        this.publisher.publish(
            new UsernameUpdatedEvent(command.email, command.uid)
        );
    }

    query = `
        MATCH (u:User)--(cred:Credentials)
            WHERE u.uid = $uid
        SET cred.username = $email
    `;
}
