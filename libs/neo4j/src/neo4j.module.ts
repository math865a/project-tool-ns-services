import {Module, Global} from "@nestjs/common"
import { Neo4jClient } from "./neo4j.client";
import { Neo4jProvider } from "./neo4j.provider";

@Module({
    providers: [Neo4jProvider, Neo4jClient],
    exports: [Neo4jClient]
})
export class Neo4jModule {}