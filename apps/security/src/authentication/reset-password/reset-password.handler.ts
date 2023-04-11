import {
    FormResponse,
    FormSuccessResponse
} from "@ns/definitions";
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

    async execute({ email }: ResetPasswordCommand): Promise<FormResponse> {
        const newPassword = generatePassword()
        const queryResult = await this.client.write(this.query, {
            email: email,
            password: newPassword,
        });
        if (queryResult.summary.updateStatistics.containsSystemUpdates()) {
            this.publisher.publish(new PasswordResetEvent());
        }
        return new FormSuccessResponse({
            message:
                "Såfremt mailen eksisterer, er der sendt en mail med et nyt kodeord",
        });
    }


    query = `
        MATCH (cred:Credentials)--(u:User)
            WHERE cred.username = $email
        SET cred += {
            password: $password,
            changedAt: timestamp()
        }
   `;
}
