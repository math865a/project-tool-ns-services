import { Inject, Injectable } from "@nestjs/common";
import { MONGO_CLIENT_TOKEN } from "./mongo-constants";
import { MongoClient as Client } from "mongodb";

@Injectable()
export class MongoClient {
    constructor(@Inject(MONGO_CLIENT_TOKEN) private client: Client) {}
    private db = this.client.db(
        process.env.NODE_ENV === "production" ? "prod" : "dev"
    );
    public events = this.db.collection("events");
    public feedback = this.db.collection("feedback");
}
