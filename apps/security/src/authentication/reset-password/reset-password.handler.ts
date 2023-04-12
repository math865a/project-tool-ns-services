import { FormResponse, FormSuccessResponse } from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { PasswordResetEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { generatePassword } from "@ns/util";
import { ResetPasswordCommand } from "./reset-password.command";

@CommandHandler(ResetPasswordCommand)
export class ResetPasswordHandler
    implements ICommandHandler<ResetPasswordCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute({
        email,
        uid: id,
    }: ResetPasswordCommand): Promise<FormResponse> {
        const newPassword = generatePassword();
        const queryResult = await this.client.write(this.query, {
            email: email,
            password: newPassword,
        });
        const uid = queryResult.records[0].get("uid");
        if (uid) {
            this.publisher.publish(new PasswordResetEvent({ uid }, id));
        }
        return new FormSuccessResponse({
            message:
                id ? "Der er blevet sendt en mail med den nye adgangskode" : "Såfremt mailen eksisterer, er der sendt en mail med et nyt kodeord",
        });
    }

    query = `
        MATCH (cred:Credentials)--(u:User)
            WHERE cred.username = $email
        SET cred += {
            password: $password,
            changedAt: timestamp()
        }
        RETURN u.uid AS uid
   `;
}
