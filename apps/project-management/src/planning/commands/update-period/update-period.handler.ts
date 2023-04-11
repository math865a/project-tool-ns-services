import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { PeriodUpdatedEvent } from "@ns/events";
import { UpdatePeriodCommand } from "./update-period.command";

@CommandHandler(UpdatePeriodCommand)
export class UpdatePeriodHandler
    implements ICommandHandler<UpdatePeriodCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: UpdatePeriodCommand): Promise<FormResponse> {
        const queryResult = await this.client.write(this.query, {
            ...command.dto,
            uid: command.uid,
        });
        const result: PeriodUpdatedEvent["body"] | undefined =
            queryResult.records[0]?.get("result");
        if (queryResult.summary.updateStatistics.containsUpdates()) {
            this.publisher.publish(new PeriodUpdatedEvent(result, command.uid));
            return new FormSuccessResponse({ message: "Period er opdateret." });
        }
        return new FormErrorResponse({
            message: "Perioden kunne ikke opdateres.",
        });
    }

    query = `
        MATCH (a:Activity)
            WHERE a.id = $activityId
        CALL {
            WITH a
            RETURN {
                startDate: apoc.temporal.format(a.startDate, "YYYY-MM-dd"),
                endDate: apoc.temporal.format(a.endDate, "YYYY-MM-dd")
            } AS fromPeriod
        }
        SET a += {
            startDate: date($startDate),
            endDate: date($endDate)
        }
        WITH fromPeriod, a
        RETURN {
            activityId: a.id,
            fromPeriod: fromPeriod,
            toPeriod: {
                startDate: $startDate,
                endDate: $endDate
            },
            kind: apoc.coll.sort(
                apoc.node.labels(a)
            )[1]
        } AS result
   `;
}
