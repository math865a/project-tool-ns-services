import { Module } from '@nestjs/common';
import { MongoClientProvider } from './mongodb.provider';
import { MongoClient } from './mongodb.client';

@Module({
    providers: [MongoClientProvider, MongoClient],
    exports: [MongoClient],
})
export class MongoModule {}
