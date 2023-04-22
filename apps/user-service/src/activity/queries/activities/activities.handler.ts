import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ActivitiesQuery } from "./activities.query";
import { MongoClient } from "@ns/mongodb";

@QueryHandler(ActivitiesQuery)
export class ActivitiesHandler implements IQueryHandler<ActivitiesQuery> {
    constructor(private client: MongoClient) {}

    async execute({ query }: ActivitiesQuery) {
        const skip = query.page * query.pageSize;

        return await this.client.events
            .find()
            .skip(skip)
            .limit(query.page)
            .toArray();
    }
}
