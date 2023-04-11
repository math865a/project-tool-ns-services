import { Provider } from "@nestjs/common";
import { NEO4J_TOKEN } from "./neo4j-constants";
import neo4j from "neo4j-driver";

export const Neo4jProvider: Provider = {
    provide: NEO4J_TOKEN,
    useFactory: () => {
        return neo4j.driver(
           "neo4j://104.155.8.126:7999",
            neo4j.auth.basic(
                "neo4j",
                "password"
            ),
            { disableLosslessIntegers: true }
        );
    },
};
