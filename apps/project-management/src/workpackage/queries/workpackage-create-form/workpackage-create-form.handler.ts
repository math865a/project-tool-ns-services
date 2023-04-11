import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DateTime as dt } from "luxon";
import { Neo4jClient } from "@ns/neo4j";
import { WorkpackageCreateFormQuery } from './workpackage-create-form.query';


@QueryHandler(WorkpackageCreateFormQuery)
export class WorkpackageCreateFormQueryHandler
    implements IQueryHandler<WorkpackageCreateFormQuery, any>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any> {
        const record = await this.getRecord();
        const dates = {
            startDate: dt.now().setZone("utc").toISODate(),
            endDate: dt.now().setZone("utc").plus({months: 1}).toISODate()
        };
        return {
            ...record,
            ...dates
        }
    }

    async getRecord(): Promise<any> {
        const queryResult = await this.client.read(`
        MATCH (pm:ProjectManager)
            WHERE pm.name = "Ingen"
        RETURN {
            name: "",
            description: "",
            contract: "",
            financialSource: "",
            serialNo: "",
            projectId: "none",
            stage: "Ny",
            projectManager: pm.id
        } as record
    `);
        return queryResult.records[0].get('record');
    }
}
