import { Module } from "@nestjs/common";
import { MongoClient } from "./mongodb.client";
import { MongoClientProvider } from "./mongodb.provider";

@Module({
    providers: [MongoClientProvider, MongoClient],
    exports: [MongoClient],
})
export class MongoModule {}
