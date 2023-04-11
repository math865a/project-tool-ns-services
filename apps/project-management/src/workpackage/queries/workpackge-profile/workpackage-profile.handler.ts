import { Neo4jClient } from "@ns/neo4j";
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

import { WorkpackageProfileQuery } from './workpackage-profile.query';

@QueryHandler(WorkpackageProfileQuery)
export class WorkpackageProfileQueryHandler
    implements IQueryHandler<WorkpackageProfileQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: WorkpackageProfileQuery): Promise<any> {
        return await Promise.all([
            this.getProfile(query.workpackageId),
            this.getOptions(),
        ]).then((res) => ({
            ...res[0],
            options: res[1],
        }));
    }

    async getProfile(workpackageId: string) {
        const queryResult = await this.client.read(this.query, {
            workpackageId,
        });
        return queryResult.records[0].get('profile');
    }

    async getOptions() {
        const queryResult = await this.client.read(this.optionsQuery);
        return queryResult.records[0].get('options');
    }

    query = `
        MATCH (w:Workpackage)
            WHERE w.id = $workpackageId

        //Foreign keys
        CALL {
            WITH w
            MATCH (w)--(p:Plan)
            MATCH (w)--(c:Contract)
            MATCH (w)--(f:FinancialSource)
            MATCH (w)--(s:Stage)
            MATCH (w)--(bs:BookingStage)

            RETURN {
                contractId: c.id,
                financialSourceId: f.id,
                stageId: s.name,
                bookingStageId: bs.name,
                planId: p.id
            } AS foreignKeys
        }

        //Managers
        CALL {
            WITH w
            //Project manager
            CALL {
                WITH w
                MATCH (w)--(:Plan)<-[:MANAGES]-(pm:ProjectManager)
                RETURN {
                    id: pm.id,
                    name: pm.name,
                    color: pm.color
                } AS projectManager
            }

            RETURN {
                projectManager: projectManager
            } AS managers
        }

        RETURN {
            node: w{.*},
            foreignKeys: foreignKeys,
            managers: managers
        } AS profile
    `;

    optionsQuery = `
        //Contract options
        CALL {
            MATCH (c:Contract) 
            WITH c ORDER BY c.name
            WITH collect(c{.*}) as contracts
            RETURN contracts
        }

        //FinancialSource options
        CALL {
            MATCH (f:FinancialSource) 
            WITH f ORDER BY f.name
            WITH collect(f{.*}) as financialSources
            RETURN financialSources
        }

        //Stage options
        CALl {
            MATCH (s:Stage)
            WITH s ORDER BY s.sequence
            WITH {
                id: s.name,
                name: s.name,
                color: s.color
            } AS stage
            WITH collect(stage) AS stages
            RETURN stages
        }

        //Booking stage options
        CALL {
            MATCH (bs:BookingStage)
            WITH bs ORDER BY bs.sequence
            WITH {
                id: bs.name,
                name: bs.name,
                color: bs.color
            } AS bookingStage
            WITH collect(bookingStage) AS bookingStages
            RETURN bookingStages
        }


        RETURN {
            contracts: contracts,
            financialSources: financialSources,
            stages: stages,
            bookingStages: bookingStages
        } AS options
    `;
}

/*            //Proposition manager
            CALL {
                WITH w
                MATCH (w)--(:Proposition)<-[:MANAGES]-(pm:ProjectManager)
                RETURN {
                    id: pm.id,
                    name: pm.name,
                    color: pm.color
                } AS propositionManager
            }*/