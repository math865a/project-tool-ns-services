import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { Neo4jClient } from "@ns/neo4j";

export class UserResourceFormQuery {
    constructor(public readonly uid?: string) {}
}

@QueryHandler(UserResourceFormQuery)
export class UserResourceFormQueryHandler
    implements IQueryHandler<UserResourceFormQuery>
{
    constructor(private readonly client: Neo4jClient) {}

    async execute(query: UserResourceFormQuery): Promise<any> {
        return await Promise.all([
            this.getOptions(),
            this.getRecord(query.uid),
        ]).then((res) => ({ record: res[1], options: res[0] }));
    }

    async getOptions() {
        const queryResult = await this.client.read(this.optionsQuery);
        return queryResult.records[0].get("options");
    }

    async getRecord(uid?: string) {
        const { calendar, name } = await Promise.all([
            this.getDefaultCalendar(),
            this.getUserName(uid),
        ]).then((res) => ({ calendar: res[0], name: res[1] }));

        return {
            name,
            initials: "",
            costDefault: 0,
            costOvertime: 0,
            resourceTypes: [],
            calendar,
        };
    }

    async getDefaultCalendar() {
        const queryResult = await this.client.read(`
            MATCH (c:Calendar {isDefault: true})
            RETURN c.id AS calendar
        `);
        return queryResult.records[0].get("calendar") as string;
    }

    async getUserName(uid?: string) {
        if (!uid) return "ingen";
        const queryResult = await this.client.read(
            `
            MATCH (u:User {uid: $uid})
            RETURN u.name AS name
        `,
            { uid }
        );
        return queryResult.records[0].get("name") as string;
    }

    optionsQuery = `
            CALL {
                MATCH (c:Calendar)
                RETURN collect({id: c.id, name: c.name, isDefault: c.isDefault}) as calendars
            }
            CALL {
                MATCH (r:ResourceType)--(c:Contract)
                RETURN collect({id: r.id, name: r.name, contractName: c.name}) as resourceTypes
            }
            RETURN {
                calendars: calendars,
                resourceTypes: resourceTypes
            } AS options
    `;
}
