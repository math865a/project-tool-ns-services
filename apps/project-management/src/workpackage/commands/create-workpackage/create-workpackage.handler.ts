import { WorkpackageCreatedEvent } from "@ns/events";
import {
    ValidateSystematicNameQuery,
    ValidateSystematicNameQueryHandler,
} from "../../queries";
import { Neo4jClient } from "@ns/neo4j";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";

import { CreateWorkpackageCommand } from "./create-workpackage.command";
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse,
    FormResponse,
    FormSuccessResponse,
} from "@ns/definitions";

@CommandHandler(CreateWorkpackageCommand)
export class CreateWorkpackageHandler
    implements ICommandHandler<CreateWorkpackageCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly validate: ValidateSystematicNameQueryHandler,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: CreateWorkpackageCommand): Promise<FormResponse> {
        const systematicName = await this.validate.execute(
            new ValidateSystematicNameQuery(
                command.dto.contract,
                command.dto.financialSource,
                command.dto.serialNo
            )
        );
        if (systematicName instanceof FormErrorResponse) {
            return systematicName;
        }

        const queryResult = await this.client.write(this.query, {
            name: command.dto.name ?? "",
            description: command.dto.description ?? "",
            serialNo: command.dto.serialNo,
            contract: command.dto.contract,
            financialSource: command.dto.financialSource,
            systematicName: systematicName,
            projectManager: command.dto.projectManager,
            startDate: command.dto.startDate,
            endDate: command.dto.endDate,
            stage: command.dto.stage,
            uid: command.uid,
        });
        const result = queryResult.records[0]?.get("result");
        if (result) {
            this.publisher.publish(new WorkpackageCreatedEvent());
            return new FormSuccessResponse({
                id: result.workpackage.id,
            });
        }
        return new FormErrorResponse({
            message: "Arbejdspakken blev ikke oprettet.",
        });
    }

    query = `
        MATCH (u:User {uid: $uid})
        CREATE (w:Workpackage {
            id: apoc.create.uuid(),
            name: $name,
            description: $description,
            serialNo: $serialNo,
            systematicName: $systematicName
        })
        MERGE (u)-[:CREATED_BY {timestamp: timestamp()}]->(u)
        WITH w

        CALL {
            WITH w
            MATCH (s:Stage)
                WHERE s.name = $stage
            MERGE (w)-[:AT_STAGE {modifiedAt: timestamp(), modifiedBy: $uid}]->(s)
            RETURN s{.*} AS stage
        }

        CALL {
            WITH w
            MATCH (c:Contract {id: $contract})
            MERGE (w)-[:IS_UNDER]->(c)
            RETURN c{.*} AS contract
        }

        CALL {
            WITH w
            MATCH (f:FinancialSource {id: $financialSource})
            MERGE (w)-[:IS_FINANCED_BY]->(f)
            RETURN f{.*} AS financialSource
        }
        CALL {
            WITH w
            MATCH (b:BookingStage {name: "Ingen"})
            MERGE (w)-[:AT {updatedAt: timestamp(), uid: $uid}]->(b)
        }

        CALL {
            WITH w
            CREATE (pl:Plan:Activity {
                id: apoc.create.uuid(),
                startDate: date($startDate),
                endDate: date($endDate),
                cost: 0,
                sales: 0,
                profit: 0,
                coverage: 0,
                defaultWork: 0,
                overtimeWork: 0,
                totalWork: 0
            })
            RETURN pl
        }
        CALL {
            WITH pl
            MATCH (pm:ProjectManager)
                WHERE pm.id = $projectManager
            MERGE (pm)-[:MANAGES]->(pl)
        }


    MERGE (pl)-[:CREATED_BY {timestamp: timestamp()}]->(u)
    MERGE (w)-[:HAS]->(pl)
        

        RETURN {
            workpackage: w{.*},
            contract: contract,
            financialSource: financialSource,
            stage: stage
        } AS result
        `;
}
