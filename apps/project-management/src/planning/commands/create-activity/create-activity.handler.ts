import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { DomainEvents } from "@ns/cqrs";
import { CreateActivityCommand } from "./create-activity.command";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { ActivityCreatedEvent } from "@ns/events";

@CommandHandler(CreateActivityCommand)
export class CreateActivityHandler
    implements ICommandHandler<CreateActivityCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: CreateActivityCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            properties: command.dto.properties,
            kind: command.dto.kind,
            parent: command.dto.parent,
            uid: command.uid,
        });
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(
                new ActivityCreatedEvent(command.dto, command.uid)
            );
            return new FormSuccessResponse({
                message: "Aktiviteten blev oprettet.",
            });
        }
        return new FormErrorResponse({
            message: "Aktiviteten blev ikke oprettet.",
        });
    }

    query = `
        MATCH (u:User {uid: $uid})
        MATCH (p:Activity)
            WHERE p.id = $parent.id

        CALL apoc.create.node(
            ["Activity", $kind],
            $properties
        )
        YIELD node AS activity


        SET activity += {
            startDate: date(p.startDate),
            endDate: date(p.endDate),
            cost: 0,
            sales: 0,
            profit: 0,
            coverage: 0,
            defaultWork: 0,
            overtimeWork: 0,
            totalWork: 0
        }
        MERGE (p)-[:HAS]->(activity)
        MERGE (activity)-[:CREATED_BY {timestamp: timestamp()}]->(u)
        
        WITH p, activity

        CALL {
            WITH p
            UNWIND range(0, size($parent.children)) AS seq
            MATCH (p)-[rel:HAS]->(child:Activity {id: $parent.children[seq]})
            SET rel.sequence = toInteger(seq)
        }

        RETURN activity{.*} AS result
   `;
}
