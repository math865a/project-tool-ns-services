import { Module } from "@nestjs/common";
import { CQRSModule } from "@ns/cqrs";
import { NatsModule } from "@ns/nats";
import { Neo4jModule } from "@ns/neo4j";
import { commandHandlers } from "./commands/handlers";
import { PresenceNatsController } from "./presence.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...commandHandlers, ...queryHandlers],
    controllers: [PresenceNatsController],
})
export class PresenceModule {}
