import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DomainEvents } from "@ns/cqrs";
import {
    FormErrorResponse, FormResponse, FormSuccessResponse
} from '@ns/definitions';
import { CreateResourceTypeDto } from '@ns/dto';
import { ResourcetypeCreatedEvent } from '@ns/events';
import { Neo4jClient } from "@ns/neo4j";
import { CreateResourceTypeCommand } from './create-resourcetype.command';

@CommandHandler(CreateResourceTypeCommand)
export class CreateResourceTypeHandler
    implements ICommandHandler<CreateResourceTypeCommand, FormResponse>
{
    constructor(
        private readonly client: Neo4jClient,
        private readonly publisher: DomainEvents
    ) {}

    async execute(command: CreateResourceTypeCommand): Promise<FormResponse> {
        const validation = await this.checkDuplicates(command.dto);

        if (typeof validation !== 'boolean') {
            return validation;
        }
        const result = await this.create(command.dto, command.uid);
        this.publisher.publish(
            new ResourcetypeCreatedEvent()
        );

        const response = new FormSuccessResponse({
            id: result.resourceType.id,
        });
        return response;
    }

    async checkDuplicates(dto: CreateResourceTypeDto) {
        const duplicates = await this.client.read(this.duplicatesQuery, {
            contract: dto.contract,
            typeNo: dto.typeNo,
            abbrevation: dto.abbrevation,
            name: dto.name,
        });
        const result: { abbrevation: boolean; name: boolean; typeNo: boolean } =
            duplicates.records[0].get('duplicates');
        const errors: { [index: string]: string } = {};
        if (result.abbrevation) {
            errors.abbrevation =
                'En ressourcetype med denne forkortelse eksisterer allerede på den valgte kontrakt.';
        }
        if (result.name) {
            errors.name =
                'En ressourcetype med dette navn eksisterer allerede på den valgte kontrakt.';
        }
        if (result.typeNo) {
            errors.typeNo =
                'En ressourcetype med dette typenummer eksisterer allerede på den valgte kontrakt.';
        }
        if (Object.keys(errors).length > 0) {
            return new FormErrorResponse({ validation: errors });
        }
        return true;
    }

    async create(dto: CreateResourceTypeDto, uid: string) {
        const queryResult = await this.client.write(this.query, {
            ...dto,
            uid: uid,
        });
        return queryResult.records[0].get('result');
    }

    duplicatesQuery = `
        MATCH (c:Contract)
            WHERE c.id = $contract
        WITH 
            exists(
                (c)--(:ResourceType {typeNo: $typeNo})    
            ) AS typeNoExists,
            exists(
                (c)--(:ResourceType {name: $name})
            ) AS nameExists,
            exists(
                (c)--(:ResourceType {abbrevation: $abbrevation})
            ) AS abbrevationExists
        RETURN {
            typeNo: typeNoExists,
            name: nameExists,
            abbrevation: abbrevationExists
        } AS duplicates
    
    `;

    query = `
        MATCH (u:User {uid: $uid})
        MATCH (c:Contract) WHERE c.id = $contract
        CREATE (rt:ResourceType {
            id: apoc.create.uuid(),
            name: $name,
            abbrevation: $abbrevation,
            typeNo: toInteger($typeNo),
            salesDefault: $salesDefault,
            salesOvertime: $salesOvertime
        })
        MERGE (rt)-[:CREATED_BY {timestamp: timestamp()}]->(u)
        MERGE (rt)-[:IS_AGREED_UNDER]->(c)
        WITH rt
        CALL {
            WITH rt
            UNWIND $resources AS resourceId
            MATCH (r:Resource) WHERE r.id = resourceId
            CREATE (a:Agent {
                id: apoc.create.uuid()
            })
            MERGE (a)-[:IS]->(r)
            MERGE (a)-[:IS]->(rt)
        }
        RETURN {
            resourceType: rt{.*}
        } AS result
   `;
}
