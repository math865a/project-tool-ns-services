import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { DateTime as dt } from "luxon";
import { Neo4jClient } from "@ns/neo4j";
import { TogglePresenceCommand } from "./toggle-presence.command";
import { UserPresenceChangedEvent } from "@ns/events";


@CommandHandler(TogglePresenceCommand)
export class TogglePresenceHandler
    implements ICommandHandler<TogglePresenceCommand, void>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: TogglePresenceCommand) {
        const { uid, isOnline } = command;
        const properties = this.getProperties(isOnline);
        const queryResult = await this.client.write(this.query, {
            uid,
            properties,
        });
        const data = queryResult.records[0].get("data");

        this.publisher.publish(
            new UserPresenceChangedEvent(uid, isOnline)
        );
    }

    query = `
        MATCH (u:User {uid: $uid})
        SET u += $properties
        WITH u
        RETURN u{.*} AS data

    `;

    getProperties(status: boolean) {
        if (status) {
            return {
                isOnline: true,
                lastSeen: dt.now().setZone("utc").toMillis(),
            };
        } else {
            return {
                isOnline: false,
                lastSeen: dt.now().setZone("utc").toMillis(),
            };
        }
    }
}
