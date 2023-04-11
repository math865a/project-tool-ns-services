import { CommandHandler, ICommand, ICommandHandler } from "@nestjs/cqrs";
import { DeleteUserCommand } from "./delete-user.command";
import { FormErrorResponse, FormResponse, FormSuccessResponse } from "@ns/definitions";
import { DomainEvents } from "@ns/cqrs";
import { Neo4jClient } from "@ns/neo4j";
import { UserDeletedEvent, UserRemovedEvent } from "@ns/events";

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand, FormResponse> {

    constructor(private client: Neo4jClient, private publisher: DomainEvents) {}

    async execute(command: DeleteUserCommand): Promise<FormResponse> {
        const { id, uid } = command;
        const shouldDelete = await this.examineLabels(id);
        if (shouldDelete) {
            const deleted = await this.deleteUser(id);
            if (deleted) {
                this.publisher.publish(new UserDeletedEvent({uid: id}, uid));
                return new FormSuccessResponse({
                    message: "Brugeren er blevet slettet",
                });
            }
        } else {
            const removed = await this.removeUser(id);
            if (removed) {
                this.publisher.publish(new UserRemovedEvent({uid: id}, uid));
                return new FormSuccessResponse({
                    message: "Brugeren er blevet fjernet",
                });
            }
        }
        return new FormErrorResponse({
            message: "Der skete en fejl under sletning af brugeren",
        });
    }

    async examineLabels(uid: string) {
        const queryResult = await this.client.read(this.labelsQuery, { uid });
        const labels = queryResult.records[0].get("uLabels")
        console.log(labels)
        return labels.length === 1;
    }

    labelsQuery = `
        MATCH (u:User)
            WHERE u.uid = $uid
        WITH labels(u) AS uLabels
        RETURN uLabels as uLabels
    `;
    async deleteUser(uid: string) {
        const queryResult = await this.client.write(this.deleteQuery, { uid });
        const { summary } = queryResult;
        return summary.updateStatistics.containsUpdates();
    }

    deleteQuery = `
        MATCH (u:User)
            WHERE u.uid = $uid
        DETACH DELETE u
    `;

    async removeUser(uid: string) {
        const queryResult = await this.client.write(this.removeQuery, {
            uid,
        });
        const { summary } = queryResult;
        return summary.updateStatistics.containsUpdates();
    }

    removeQuery = `
        MATCH (u:User)
            WHERE u.uid = $uid
        CALL {
            WITH u
            OPTIONAL MATCH (u)-[rel:IN_ACCESS_GROUP]->()
            DELETE rel
        }
        CALL {
            WITH u
            MATCH (u)--(cred:Credentials)
            DETACH DELETE cred
        }
        CALL {
            WITH u
            OPTIONAL MATCH (u)-[rel:CREATED_BY|UPDATED_BY|DELETED_BY]->()
            DELETE rel
        }
        REMOVE u:User
        REMOVE u.uid
        REMOVE u.email
        REMOVE u.isDeactivated
        REMOVE u.lastSeen
        REMOVE u.isOnline
    `;
}