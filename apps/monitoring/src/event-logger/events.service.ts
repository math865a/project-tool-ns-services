import { Injectable } from "@nestjs/common";
import { MongoClient } from "@ns/mongodb";

@Injectable()
export class EventsService {
    constructor(private client: MongoClient) {}

    async persistEvent(event: any) {
        await this.client.events.insertOne(event);
    }
}
