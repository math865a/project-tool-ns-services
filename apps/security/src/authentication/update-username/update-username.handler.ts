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
        const hasEmailChanged = await this.hasEmailChanged(
            command.uid,
            command.email
        );
        if (hasEmailChanged) {
            await this.updateUsername(command.uid, command.email);
        }
    }

    async hasEmailChanged(uid: string, email: string) {
        const result = await this.client.read(this.getCurrentEmail, {
            uid: uid,
        });
        return result.records[0].get("currentMail") !== email;
    }

    getCurrentEmail = `
        MATCH (u:User)-(c:Credentials)
            WHERE u.uid = $uid
        RETURN u.username as currentMail
    `;

    async updateUsername(uid: string, email: string) {
        const result = await this.client.write(this.updateUsernameQuery, {
            email: email.trim().toLowerCase(),
            uid: uid,
        });
        if (result.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new UsernameUpdatedEvent(email, uid));
        }
    }

    updateUsernameQuery = `
        MATCH (u:User)--(cred:Credentials)
            WHERE u.uid = $uid
        SET cred.username = $email
    `;
}
