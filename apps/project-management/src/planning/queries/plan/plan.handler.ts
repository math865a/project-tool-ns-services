import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { PlanQuery } from "./plan.query";

@QueryHandler(PlanQuery)
export class PlanQueryHandler
    implements IQueryHandler<PlanQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute({ workpackageId }: PlanQuery): Promise<any> {
        return await Promise.all([
            this.getActivities(workpackageId),
            this.getTeam(workpackageId),
            this.getAssignments(workpackageId),
        ]).then((res) => ({
            activities: res[0],
            team: res[1],
            assignments: res[2],
        }));
    }

    async getActivities(workpackageId: string) {
        const queryResult = await this.client.read(this.rowQuery, {
            workpackageId: workpackageId,
        });
        return queryResult.records[0]?.get("activities");
    }

    async getTeam(workpackageId: string) {
        const queryResult = await this.client.read(this.teamQuery, {
            workpackageId: workpackageId,
        });
        return queryResult.records.map((d) => d.get("teamMember"));
    }

    async getAssignments(workpackageId: string) {
        const queryResult = await this.client.read(this.assignmentQuery, {
            workpackageId: workpackageId,
        });
        return queryResult.records.map((d) => d.get("assignment"));
    }

    rowQuery = `
        MATCH (w:Workpackage)-[:HAS]->(plan:Plan)
            WHERE w.id = $workpackageId
        
        CALL {
            WITH plan
            MATCH (plan)-[rel:HAS]->(delivery:Delivery)
            WITH delivery, rel ORDER BY rel.sequence
            WITH collect(delivery) AS deliveries, collect(delivery.id) AS planChildren
            RETURN deliveries, planChildren
        }
        
        CALL {
            WITH plan, planChildren
            WITH {
                id: plan.id,
                children: planChildren,
                kind: "Plan",
                startDate: plan.startDate,
                endDate: plan.endDate,
                children: planChildren
            } AS planActivity
            RETURN planActivity
        }

        CALL {
            WITH deliveries
            UNWIND deliveries AS delivery
                OPTIONAL MATCH (delivery)-[rel:HAS]->(task:Task)
                WITH delivery, task, rel ORDER BY rel.sequence
                WITH delivery, collect(task) AS deliveryTasks, collect(task.id) AS deliveryChildren
            WITH collect({
                id: delivery.id,
                name: delivery.name,
                description: delivery.description,
                color: delivery.color,
                kind: "Delivery",
                children: deliveryChildren,
                startDate: delivery.startDate,
                endDate: delivery.endDate
            }) AS deliveryActivities, 
            apoc.coll.flatten(collect(deliveryTasks)) AS tasks
            RETURN deliveryActivities, tasks
        }
        
        CALL {
            WITH tasks
            UNWIND tasks AS task
                OPTIONAL MATCH (task)<-[rel:IS_ASSIGNED_TO]-(agent:Agent)
                WITH collect(rel.id) AS taskChildren, task
            WITH collect({
                id: task.id,
                name: task.name,
                description: task.description,
                kind: "Task",
                children: taskChildren,
                startDate: task.startDate,
                endDate: task.endDate
            }) AS taskActivities
            RETURN taskActivities
        }

        CALL {
            WITH planActivity, deliveryActivities, taskActivities
            WITH apoc.coll.flatten([planActivity, deliveryActivities, taskActivities]) AS activities
            RETURN activities
        }
        RETURN activities
    `;

    teamQuery = `
        MATCH (r:Resource)<-[:IS]-(a:Agent)-[:IS]->(rt:ResourceType) 
            WHERE (a)-[*2]-(:Workpackage {id: $workpackageId})
        RETURN {
            id: a.id,
            resource: {
                id: r.id,
                name: r.name,
                color: r.color,
                costRate: {
                    default: r.costDefault,
                    overtime: r.costOvertime
                }
            },
            resourceType: {
                id: rt.id,
                name: rt.name,
                typeNo: rt.typeNo,
                abbrevation: rt.abbrevation,
                salesRate: {
                    default: rt.salesDefault,
                    overtime: rt.salesOvertime
                }
            }
        } AS teamMember
    `;

    assignmentQuery = `
        MATCH (w:Workpackage)
            WHERE w.id = $workpackageId

        MATCH (task:Task)<-[rel:IS_ASSIGNED_TO]-(agent:Agent)
            WHERE (task)<-[:HAS*3]-(w)
        CALL {
            WITH task, agent
            OPTIONAL MATCH (task)-[:HAS]->(allocation:Allocation)
                WHERE (allocation)<-[:IS_ASSIGNED_TO]-(agent)
            WITH collect({
                id: allocation.id,
                interval: {
                    start: allocation.startDate,
                    end: allocation.endDate
                },
                timesheet: {
                    defaultMinutes: allocation.defaultMinutes,
                    overtimeMinutes: allocation.overtimeMinutes
                }
            }) AS allocationArr
            RETURN CASE
                WHEN allocationArr[0].id IS NOT NULL
                    THEN allocationArr
                ELSE []
            END AS allocations
        }
        RETURN {
            id: rel.id,
            task: task.id,
            agent: agent.id,
            allocations: allocations
        } AS assignment
    `;
}
