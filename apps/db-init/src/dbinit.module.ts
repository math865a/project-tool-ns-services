import { Module } from "@nestjs/common";
import { Neo4jModule } from "@ns/neo4j";
import { DBInitService } from "./service";


@Module({
    imports: [Neo4jModule],
    providers: [DBInitService]

})
export class DBInitModule{}