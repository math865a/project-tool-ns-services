import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { SwapTeamMemberCommand } from "./swap-team-member.command";

@CommandHandler(SwapTeamMemberCommand)
export class SwapTeamMemberHandler
    implements ICommandHandler<SwapTeamMemberCommand>
{
    constructor(private client: Neo4jClient) {}

    async execute({ dto }: SwapTeamMemberCommand): Promise<any> {
        await this.client.write(this.query, {
            workpackageId: dto.workpackageId,
            fromAgent: dto.fromAgent,
            toAgent: dto.toAgent,
        });
    }

    query = `
        MATCH (w:Workpackage)--(plan:Plan)
            WHERE w.id = $workpackageId

        MATCH (fromAgent:Agent)-[pRel:IS_ASSIGNED_TO]->(plan)
            WHERE fromAgent.id = $fromAgent
        MATCH (toAgent:Agent)
            WHERE toAgent.id = $toAgent


        CALL {
            WITH fromAgent, plan, toAgent
            MATCH (fromAgent)-[aRel:IS_ASSIGNED_TO]->(a:Allocation)<-[:HAS*3]-(plan)
            CALL apoc.refactor.from(aRel, toAgent)
            YIELD output
            RETURN {} AS nothing
        }

        CALL {
            WITH fromAgent, plan, toAgent
            MATCH (fromAgent)-[tRel:IS_ASSIGNED_TO]->(t:Task)<-[:HAS*2]-(plan)
            DELETE tRel
    
            WITH collect(t) AS tasks
            RETURN tasks
        }

        CALL {
            WITH tasks, toAgent
            UNWIND tasks AS t
                MERGE (toAgent)-[:IS_ASSIGNED_TO]->(t)
        }

        

        RETURN {} AS result
    `;
}

//DELETE pRel
