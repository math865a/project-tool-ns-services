import { Global, Module } from "@nestjs/common";
import { CQRSModule } from "@ns/cqrs";
import { NatsModule } from "@ns/nats";
import { Neo4jModule } from "@ns/neo4j";

@Global()
@Module({
    imports: [Neo4jModule, NatsModule, CQRSModule],
    exports: [Neo4jModule, NatsModule, CQRSModule],
})
export class ServiceModule {}
