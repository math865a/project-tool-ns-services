import { Provider } from "@nestjs/common";
import { MongoClient } from "mongodb";
import { MONGO_CLIENT_TOKEN } from "./mongo-constants";

export const MongoClientProvider: Provider<MongoClient> = {
    provide: MONGO_CLIENT_TOKEN,
    useFactory: async (): Promise<MongoClient> => {
        return new MongoClient("mongodb://event-db:27017");
    },
};
