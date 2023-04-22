import { Module } from "@nestjs/common";
import { MongoModule } from "@ns/mongodb";
import { queryHandlers } from "@ns/session/queries";
import { ActivityController } from "./activity.controller";

@Module({
    imports: [MongoModule],
    providers: [...queryHandlers],
    controllers: [ActivityController],
})
export class ActivityModule {}
