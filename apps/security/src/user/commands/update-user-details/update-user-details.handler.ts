import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { UserDetailsUpdatedEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { UpdateUserDetailsCommand } from "./update-user-details.command";

@CommandHandler(UpdateUserDetailsCommand)
export class UpdateUserDetailsHandler
    implements ICommandHandler<UpdateUserDetailsCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}
    async execute({
        dto,
        uid,
    }: UpdateUserDetailsCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            uid: uid,
            ...dto,
        });
        if (queryResult.summary.counters.containsUpdates()) {
            this.publisher.publish(new UserDetailsUpdatedEvent(dto, uid));
            return new FormSuccessResponse({
                message: "Dine oplysninger blev opdateret.",
            });
        }
        return new FormErrorResponse({
            message:
                "Der skete en fejl under opdateringen af dine oplysninger.",
        });
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid
        SET u += {
            name: $name,
            email: $email,
            color: $color
        }
    `;
}
