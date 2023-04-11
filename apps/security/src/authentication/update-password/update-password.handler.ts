import {
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { PasswordUpdatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { UpdatePasswordCommand } from "./update-password.command";

@CommandHandler(UpdatePasswordCommand)
export class UpdatePasswordHandler
    implements ICommandHandler<UpdatePasswordCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute({
        password,
        uid,
    }: UpdatePasswordCommand): Promise<FormResponse> {
        await this.client.write(this.query, {
            uid: uid,
            password: password,
        });
        this.publisher.publish(new PasswordUpdatedEvent());
        return new FormSuccessResponse({
            message: "Adgangskoden blev ændret.",
        });
    }

    query = `
        MATCH (u:User)--(cred:Credentials)
            WHERE u.uid = $uid
        SET cred += {
            password: $password,
            changedAt: timestamp()
        }
   `;
}
