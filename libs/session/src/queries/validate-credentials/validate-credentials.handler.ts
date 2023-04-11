import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { DomainEvents } from '@ns/cqrs';
import { InvalidCredentialsEvent, ValidCredentialsEvent } from '@ns/events';
import { Neo4jClient } from '@ns/neo4j';
import { ValidateCredentialsQuery } from './validate-credentials.query';

@QueryHandler(ValidateCredentialsQuery)
export class ValidateCredentialsHandler
    implements IQueryHandler<ValidateCredentialsQuery, {uid: string | null} >
{
    constructor(private readonly client: Neo4jClient, private publisher: DomainEvents) {}

    async execute({
        email,
        password,
    }: ValidateCredentialsQuery): Promise<{uid: string} | null> {
        const queryResult = await this.client.read(this.query, {
            email,
            password,
        });
        const uid =  queryResult.records[0]?.get('uid') ?? null;
        if (uid){
            this.publisher.publish(new ValidCredentialsEvent())
            
        } else {
            this.publisher.publish(new InvalidCredentialsEvent())
        }
        return {uid};
    }

    query = `
        MATCH (a:Credentials)--(u:User)
            WHERE a.password = $password AND a.username = $email
        RETURN u.uid as uid
    `;
}
