import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { ResourceProfileQuery } from "./resource-profile.query";

@QueryHandler(ResourceProfileQuery)
export class ResourceProfileQueryHandler
    implements IQueryHandler<ResourceProfileQuery, any>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: ResourceProfileQuery): Promise<any> {
        const queryResult = await this.client.read(this.query, {
            resourceId: query.resourceId,
        });
        return queryResult.records[0].get("profile");
    }

    query = `
        MATCH (r:Resource {id: $resourceId})

        CALL {
            WITH r
            RETURN CASE
                WHEN "ProjectManager" IN labels(r)
                    THEN true
                ELSE false
            END AS isProjectManager
        }

        CALL {
            WITH r
            RETURN CASE
                WHEN "User" IN labels(r)
                    THEN true
                ELSE false
            END AS isUser
        }

        RETURN r{.*, isUser: isUser, isProjectManager: isProjectManager} AS profile
    `;
}

/*        CALL {
            WITH r
            OPTIONAL MATCH (r)--(:Agent)--(rt:ResourceType)
            WITH DISTINCT rt
            MATCH (rt)--(c:Contract)
            RETURN collect({resourceType: rt{.*}, contract: c{.*}}) AS resourcetypes
        }
        CALL {
            WITH r
            RETURN CASE
                WHEN "ProjectManager" IN labels(r)
                    THEN true
                ELSE false
            END AS isProjectManager
        }
        RETURN {
            node: r{.*},
            resourceTypes: resourcetypes,
            isProjectManager: isProjectManager
        } AS profile*/