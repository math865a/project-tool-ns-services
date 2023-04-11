import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { AgentCreatedEvent } from "@ns/events";
import { CreateAgentCommand } from "./create-agent.command";
import { CreateAgentDto } from "@ns/dto";

@CommandHandler(CreateAgentCommand)
export class CreateAgentHandler
    implements ICommandHandler<CreateAgentCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: CreateAgentCommand): Promise<FormResponse> {
        const exists = await this.checkIfExists(command.dto);
        if (exists) {
            return new FormErrorResponse({
                message: "Der findes allerede en agent på denne ressource",
            });
        }
        const queryResult = await this.client.write(this.query, {
            resourceId: command.dto.resourceId,
            resourceTypeId: command.dto.resourcetypeId,
            uid: command.uid,
        });
        const result = queryResult.records[0].get("agentId");
        if (!result) {
            return new FormErrorResponse({ message: "Der skete en fejl" });
        }
        this.publisher.publish(
            new AgentCreatedEvent(
                { agentId: result, ...command.dto },
                command.uid
            )
        );
        return new FormSuccessResponse({
            id: result,
            message: "Agent oprettet",
        });
    }

    async checkIfExists(dto: CreateAgentDto){
        const queryResult = await this.client.read(this.existsQuery, dto);
        const result = queryResult.records[0].get("agentExists");
        return result;
    }

    existsQuery = `
        OPTIONAL MATCH (a:Agent)
            WHERE (a)-[:IS]->(:Resource {id: $resourceId})
            AND (a)-[:IS]->(:ResourceType {id: $resourcetypeId})
        RETURN CASE
            WHEN a IS NULL THEN false
            ELSE true
        END AS agentExists
    
    `

    query = `
        MATCH (u:User {uid: $uid})
        MATCH (r:Resource)
            WHERE r.id = $resourceId
        MATCH (rt:ResourceType)
            WHERE rt.id = $resourceTypeId

        CREATE (a:Agent {id: apoc.create.uuid()})
        MERGE (a)-[:IS]->(r)
        MERGE (a)-[:IS]->(rt)
        MERGE (a)-[:CREATED_BY {timestamp: timestamp()}]->(u)
        RETURN a.id AS agentId
   `;
}
