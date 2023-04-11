import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UserResourceFormQuery } from "./resource-form.query";

export class UserFormQuery {}

@QueryHandler(UserFormQuery)
export class UserFormQueryHandler
    implements IQueryHandler<UserResourceFormQuery>
{
    constructor(private client: Neo4jClient) {}

    async execute(): Promise<any> {
        return await Promise.all([
            this.getAccessGroupOptions(),
            this.getRecord(),
        ]).then((res) => ({ record: res[1], options: res[0] }));
    }

    async getAccessGroupOptions() {
        return [];
    }

    async getRecord() {
        return {
            name: "",
            email: "",
            isResource: false,
            isProjectManager: false,
            color: "#BEDADC",
            accessGroups: [],
            sendWelcomeMail: false,
        };
    }
}
