import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import {
    Action,
    IPermissions,
    PagePermissions,
    RawAbility,
    Subject,
} from "@ns/definitions";
import { Neo4jClient } from "@ns/neo4j";
import { uniq, some, forEach } from "lodash";
import { ComposeAbilitiesQuery } from "./compose-abilities.query";

@QueryHandler(ComposeAbilitiesQuery)
export class ComposeAbilitiesQueryHandler
    implements IQueryHandler<ComposeAbilitiesQuery, RawAbility[]>
{
    constructor(private client: Neo4jClient) {}

    async execute(query: ComposeAbilitiesQuery): Promise<RawAbility[]> {
        const pagePermissions = await this.queryPermissions(query.uid);
        if (!pagePermissions) return [];
        const pages = this.getPages(pagePermissions);
        return this.getAbilities(pages, pagePermissions);
    }

    async queryPermissions(uid: string) {
        const queryResult = await this.client.read(this.query, {
            uid: uid,
        });
        return queryResult.records.map((d) =>
            d.get("pagePermissions")
        ) as PagePermissions[];
    }

    query = `
        MATCH (u:User)-[:IN_ACCESS_GROUP]->(ag:AccessGroup)-[permission:HAS_PERMISSIONS]->(page:Page)
            WHERE u.uid = $uid
        WITH {
            page: page.name,
            permissions: permission{.*}
        } AS pagePermissions
        RETURN pagePermissions
    `;

    getPages(pagePermissions: PagePermissions[]) {
        return uniq(pagePermissions.map((d) => d.page));
    }

    getAbilities(pages: Subject[], pagePermissions: PagePermissions[]) {
        return pages
            .map((page) =>
                this.getPageAbilities(
                    page,
                    this.getPermissionsObject(
                        this.getPagePermissions(pagePermissions, page)
                    )
                )
            )
            .flat();
    }

    getPagePermissions(pagePermissions: PagePermissions[], page: string) {
        return pagePermissions.filter((d) => d.page === page);
    }

    getPermissionsObject(pagePermissions: PagePermissions[]): IPermissions {
        return {
            [Action.Read]: some(pagePermissions, (d) => d.permissions.read),
            [Action.Write]: some(pagePermissions, (d) => d.permissions.write),
            [Action.Delete]: some(pagePermissions, (d) => d.permissions.delete),
        };
    }

    getPageAbilities(subject: Subject, permissions: IPermissions) {
        const abilities: RawAbility[] = [];
        forEach(permissions, (value: boolean, key: Action) => {
            if (value) {
                abilities.push({ subject, action: key });
            }
        });
        return abilities;
    }
}
