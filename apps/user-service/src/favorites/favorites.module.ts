import { Module } from "@nestjs/common";
import { CQRSModule } from "@ns/cqrs";
import { NatsModule } from "@ns/nats";
import { Neo4jModule } from "@ns/neo4j";
import { commandHandlers } from "./commands";
import { FavoritesNatsController } from "./favorites.controller";
import { queryHandlers } from "./queries";

@Module({
    providers: [...queryHandlers, ...commandHandlers],
    controllers: [FavoritesNatsController],
})
export class FavoritesModule {}
