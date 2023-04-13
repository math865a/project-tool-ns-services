import { Injectable } from "@nestjs/common";
import { MongoClient } from "@ns/mongodb";
import { EventBase } from "@ns/nats";
import { ObjectId } from "mongodb";

@Injectable()
export class EventsService {
    constructor(private client: MongoClient) {}

    async persistEvent(name: string, event: EventBase) {
        const res = {
            _id: new ObjectId(),
            event: name,
            ...event
        };
        console.log("inserted event: ", res);
        await this.client.events.insertOne(res);
    }
}
