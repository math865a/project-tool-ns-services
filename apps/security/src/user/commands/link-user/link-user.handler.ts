import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LinkUserCommand } from "./link-user.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UserLinkedEvent } from "@ns/events";

@CommandHandler(LinkUserCommand)
export class LinkUserHandler
    implements ICommandHandler<LinkUserCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: LinkUserCommand): Promise<FormResponse> {
        console.log(command.dto)
        const queryResult = await this.client.write(this.query, command.dto);
        const result = queryResult.records[0].get("result");
        console.log(result)
        if (result) {
            this.publisher.publish(
                new UserLinkedEvent(
                    {
                        ...command.dto,
                        result: result,
                    },
                    command.uid
                )
            );
            return new FormSuccessResponse({ message: "Brugeren blev linket" });
        }
        return new FormErrorResponse({ message: "Brugeren kunne ikke linkes" });
    }

    query = `
        MATCH (u:User)
            WHERE u.id = $uid
        MATCH (r)
            WHERE r.id = $id

        CALL apoc.refactor.mergeNodes([u, r], {
            properties: "discard",
            mergeRels: true
        })
        YIELD node
        RETURN node{.*} AS result
    `;
}
