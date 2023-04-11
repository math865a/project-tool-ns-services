import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SplitUserCommand } from "./split-user.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { UserSplitEvent } from "@ns/events";

@CommandHandler(SplitUserCommand)
export class SplitUserHandler
    implements ICommandHandler<SplitUserCommand, FormResponse>
{
    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: SplitUserCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            id: command.id,
        });
        const result = queryResult.records[0].get("result");
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new UserSplitEvent(result, command.uid));
            return new FormSuccessResponse({
                message: "Brugeren blev splittet",
            });
        }
        return new FormErrorResponse({
            message: "Brugeren kunne ikke splittes",
        });
    }

    query = `
        MATCH (u:User:Resource)
            WHERE u.uid = $id


        CALL {
            WITH u
            CREATE (r:Resource 
                {
                    id: apoc.create.uuid(),
                    name: u.name,
                    initials: u.initials,
                    costDefault: u.costDefault,
                    costOvertime: u.costOvertime,
                    color: u.color
                }
            )
            RETURN r
        }

        CALL {
            WITH u
            REMOVE u:Resource
            REMOVE u.initials
            REMOVE u.costDefault
            REMOVE u.costOvertime 
        }

        CALL {
            WITH u,r
            MATCH (u)-[rel:USES]->(c:Calendar)
            CALL apoc.refactor.from(rel, r)
            YIELD input, output
            RETURN {} AS subResult2
        }

        CALL {
            WITH u,r
            OPTIONAL MATCH (u)<-[rel:IS]-(:Agent)
            WITH collect(rel) AS rels
            RETURN CASE
                WHEN rels[0] IS NOT NULL
                    THEN rels
                ELSE 
                    []
                END AS relations
        }

        CALL {
            WITH r, relations
            UNWIND relations AS relation
            CALL apoc.refactor.to(relation, r)
            YIELD input, output
            RETURN {} AS subResult3
        }



      


        RETURN {
            userNode: u{.*},
            resourceNode: r{.*}
        } AS result

    `;
}
