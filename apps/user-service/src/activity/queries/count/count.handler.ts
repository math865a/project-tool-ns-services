import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { MongoClient } from "@ns/mongodb";
import { CountQuery } from "./count.query";

@QueryHandler(CountQuery)
export class CountHandler implements IQueryHandler<CountQuery> {
    constructor(private client: MongoClient) {}

    async execute() {
        return await this.client.events.countDocuments();
    }
}
