
import { Neo4jClient } from "@ns/neo4j";
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

export class LoadFavoritesQuery {
    constructor(public readonly uid: string, public readonly recordIds?: string[]) {}
}

@QueryHandler(LoadFavoritesQuery)
export class LoadFavoritesQueryHandler
    implements IQueryHandler<LoadFavoritesQuery, any[]>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: LoadFavoritesQuery): Promise<any[]> {
        const queryResult = await this.client.read(this.query, {
            uid: query.uid,
            recordIds: query.recordIds ?? null
        });
        const response: any[] =
            queryResult.records[0].get('favorites') ?? [];
        return response;
    }

    query = `
        MATCH (u:User)
            WHERE u.uid = $uid
        CALL {
            WITH u
            OPTIONAL MATCH (u)-[:IS_FAVORITE]->(w:Workpackage)
                WHERE w.id IN $recordIds OR $recordIds IS NULL
            WITH collect({
                id: w.id,
                name: w.systematicName,
                type: "Arbejdspakker"
            }) AS wArr
            RETURN CASE
                WHEN wArr[0].id IS NOT NULL
                    THEN wArr
                ELSE []
            END AS workpackages
        }
        CALL {
            WITH u
            OPTIONAL MATCH (u)-[:IS_FAVORITE]->(r:Resource)
                WHERE r.id IN $recordIds OR $recordIds IS NULL
            WITH collect({
                id: r.id,
                name: r.name,
                color: r.color,
                type: "Ressourcer"
            }) AS rArr
            RETURN CASE
                WHEN rArr[0].id IS NOT NULL
                    THEN rArr
                ELSE []
            END AS resources
        }

        WITH apoc.coll.flatten([workpackages, resources]) AS favorites
        RETURN favorites
   `;
}
