import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { BookingStagesQuery } from "./booking-stages.query";

@QueryHandler(BookingStagesQuery)
export class BookingStagesHandler implements IQueryHandler<BookingStagesQuery> {
    constructor(private client: Neo4jClient) {}

    async execute(): Promise<any> {
        const queryResult = await this.client.read(this.query);
        return queryResult.records.map((record) => record.get("bookingStage"));
    }

    query = `
        MATCH (bs:BookingStage)
            WHERE bs.name <> "Ingen"
        RETURN {
            id: bs.id,
            name: bs.name,
            color: bs.color,
            sequence: bs.sequence
        } AS bookingStage
    `;
}
