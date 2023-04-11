import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import _ from "lodash";
import { Driver, QueryResult } from "neo4j-driver";
import { NEO4J_TOKEN } from "./neo4j-constants";
import { Interval as int, DateTime as dt } from "luxon";
import { capitalize } from "lodash";
@Injectable()
export class Neo4jClient {
    constructor(@Inject(NEO4J_TOKEN) public driver: Driver) {}

    async write(
        q: string,
        params?: { [index: string]: any }
    ): Promise<QueryResult> {
        const session = this.driver.session();
        let result: QueryResult;
        try {
            result = await session.executeWrite<QueryResult>((tx) =>
                tx.run(q, params)
            );
        } catch (e) {
            console.log(e);
        } finally {
            await session.close();
        }
        return result;
    }

    async read(
        q: string,
        params?: { [index: string]: any }
    ): Promise<QueryResult> {
        const session = this.driver.session();
        let result: QueryResult;
        try {
            result = await session.executeRead((tx) => tx.run(q, params));
        } catch (e) {
            console.log(e);
        } finally {
            await session.close();
        }
        return result;
    }
}
