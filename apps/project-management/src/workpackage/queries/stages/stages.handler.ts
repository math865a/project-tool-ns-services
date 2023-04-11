import { QueryHandler, IQueryHandler } from '@nestjs/cqrs'
import { Neo4jClient } from "@ns/neo4j";
import { StagesQuery } from './stages.query';

@QueryHandler(StagesQuery)
export class StagesQueryHandler implements IQueryHandler<StagesQuery, any[]>{

    constructor(private readonly client: Neo4jClient) { }

    async execute(): Promise<any[]> {
        const queryResult = await this.client.read(this.query);
        const response: any[] = queryResult.records.map(d => d.get("stage"))
        return response;
    }


    query = `
            MATCH (s:Stage)
            RETURN s{.*, id: s.name} AS stage ORDER BY stage.sequence
    `;
};