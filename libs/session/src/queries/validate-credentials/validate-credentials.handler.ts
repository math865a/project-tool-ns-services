import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { DomainEvents } from "@ns/cqrs";
import { InvalidCredentialsEvent, ValidCredentialsEvent } from "@ns/events";
import { Neo4jClient } from "@ns/neo4j";
import { ValidateCredentialsQuery } from "./validate-credentials.query";

@QueryHandler(ValidateCredentialsQuery)
export class ValidateCredentialsHandler
    implements IQueryHandler<ValidateCredentialsQuery, { uid: string | null }>
{
    constructor(
        private readonly client: Neo4jClient,
        private publisher: DomainEvents
    ) {}

    async execute({
        email,
        password,
    }: ValidateCredentialsQuery): Promise<{ uid: string | null }> {
        const params = this.prepareParams(email, password);
        const queryResult = await this.client.read(this.query, params);
        const uid = queryResult.records[0]?.get("uid") ?? null;
        if (uid) {
            this.publisher.publish(new ValidCredentialsEvent(uid));
        } else {
            this.publisher.publish(
                new InvalidCredentialsEvent(email, password)
            );
        }
        return { uid };
    }

    prepareParams(email: string, password: string) {
        return {
            email: email.trim().toLowerCase(),
            password: password,
        };
    }

    query = `
        MATCH (a:Credentials)--(u:User)
            WHERE a.password = $password AND a.username = $email
        RETURN u.uid as uid
    `;
}
