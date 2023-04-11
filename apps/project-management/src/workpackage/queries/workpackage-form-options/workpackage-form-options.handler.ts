import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { WorkpackageFormOptionsQuery } from "./workpackage-form-options.query";

@QueryHandler(WorkpackageFormOptionsQuery)
export class WorkpackageFormOptionsQueryHandler
    implements IQueryHandler<WorkpackageFormOptionsQuery, any>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(): Promise<any> {
        return await Promise.all([
            this.getFinancialSourceOptions(),
            this.getContractOptions(),
        ]).then((res) => ({
            financialSourceOptions: res[0],
            contractOptions: res[1],
        }));
    }

    async getFinancialSourceOptions() {
        const q = `
        MATCH (f:FinancialSource)
        RETURN {
            id: f.id,
            name: f.name
        } AS option
        ORDER BY option.name
    `;
        const queryResult = await this.client.read(q);
        return queryResult.records.map((d) => d.get("option"));
    }

    async getContractOptions() {
        const q = `
        MATCH (c:Contract)
        RETURN {
            id: c.id,
            name: c.name
        } AS option
        ORDER BY option.name
    `;
        const queryResult = await this.client.read(q);
        return queryResult.records.map((d) => d.get("option"));
    }
}
