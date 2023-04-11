import { FormSuccessResponse } from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { ResourceCreatedEvent } from "@ns/events";
import { CreateResourceCommand } from "./create-resource.command";
import { CreateResourceDto } from "@ns/dto";

@CommandHandler(CreateResourceCommand)
export class CreateResourceHandler
    implements ICommandHandler<CreateResourceCommand, FormSuccessResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute({
        dto,
        uid,
    }: CreateResourceCommand): Promise<FormSuccessResponse> {
        const properties = this.getProperties(dto);
        const queryResult = await this.client.write(this.query, {
            id: dto.id,
            properties: properties,
            calendar: dto.calendar,
            uid: uid,
        });
        this.publisher.publish(new ResourceCreatedEvent(dto, uid));
        return new FormSuccessResponse({ id: dto.id });
    }

    getProperties(dto: CreateResourceDto) {
        return {
            name: dto.name,
            initials: dto.initials,
            costDefault: dto.costDefault,
            costOvertime: dto.costOvertime,
            color: dto.color,
        };
    }

    query = `
        MERGE (r {
            id: $id
        })
        SET r += $properties
        SET r:Resource
        WITH r

        CALL {
            WITH r
            MATCH (c:Calendar)
                WHERE c.id = $calendar
            MERGE (r)-[:USES]->(c)
        }
   `;
}

/*MATCH (u:User {uid: $uid})
        CALL apoc.create.node($labels, {
            id: apoc.create.uuid(),
            name: $name,
            initials: $initials,
            costDefault: $costDefault,
            costOvertime: $costOvertime,
            color: $color
        })
        YIELD node AS r
        MERGE (r)-[:CREATED_BY {timestamp: timestamp()}]->(u)
        WITH r, u
        CALL {
            WITH r
            MATCH (c:Calendar)
                WHERE c.id = $calendar
            MERGE (r)-[:USES]->(c)
        }
        CALL {
            WITH r
            UNWIND $resourceTypes AS resourceTypeId
            MATCH (rt:ResourceType)
                WHERE rt.id = resourceTypeId
            CREATE (a:Agent {
                id: apoc.create.uuid()
            }) 
            MERGE (a)-[:IS]->(rt)
            MERGE (a)-[:IS]->(r)
        }
        RETURN r{.*} AS result*/
