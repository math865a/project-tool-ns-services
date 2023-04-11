import { Inject, Injectable } from "@nestjs/common";
import { MONGO_CLIENT_TOKEN } from "./mongo-constants";
import { MongoClient as Client } from "mongodb";

@Injectable()
export class MongoClient {
    constructor(@Inject(MONGO_CLIENT_TOKEN) private client: Client) {}
    public events = this.client.db("events").collection("events");
}
