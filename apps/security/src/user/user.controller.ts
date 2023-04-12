import { FormResponse, FormSuccessResponse } from "@ns/definitions";
import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
    CreateUserDto,
    LinkUserDto,
    ToggleActiveStatusDto,
    UpdateUserDetailsDto,
    UpdateUserDto,
} from "@ns/dto";
import { userPatterns as patterns } from "@ns/endpoints";
import {
    DeleteUserCommand,
    LinkUserCommand,
    SplitUserCommand,
    UpdateUserDetailsCommand,
} from "./commands";
import { CreateUserCommand } from "./commands/create-user";
import { ToggleActiveStatusCommand } from "./commands/toggle-active-status";
import { UpdateUserAccessGroupsCommand } from "./commands/update-user-access-groups";
import {
    UserConnectOptionsQuery,
    UserOptionsQuery,
    UserQuery,
    UsersViewQuery,
} from "./queries";

@Controller()
export class UsersNatsController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @MessagePattern(patterns.createUser)
    async createUser(
        @Payload("dto") dto: CreateUserDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(new CreateUserCommand(dto, uid));
    }

    @MessagePattern(patterns.updateUser)
    async updateUser(
        @Payload("dto") dto: UpdateUserDto,
        @Payload("uid") uid: string
    ) {
        return await Promise.all([
            this.commandBus.execute<UpdateUserDetailsCommand, FormResponse>(
                new UpdateUserDetailsCommand(dto, uid)
            ),
            this.commandBus.execute<
                UpdateUserAccessGroupsCommand,
                FormResponse
            >(new UpdateUserAccessGroupsCommand(dto.accessGroups, dto.uid)),
        ]).then((results) => {
            if (results[0].status === "ok" && results[1].status === "ok") {
                return new FormSuccessResponse({
                    message: "Brugeren blev opdateret",
                });
            } else if (
                results[0].status === "error" &&
                results[1].status === "error"
            ) {
                return new FormSuccessResponse({
                    message: "Brugeren kunne ikke opdateres",
                });
            } else if (results[0].status === "error") {
                return results[0];
            }
            return results[1];
        });
    }

    @MessagePattern(patterns.deleteUser)
    async delete(@Payload("id") id: string, @Payload("uid") uid: string) {
        return await this.commandBus.execute(new DeleteUserCommand(id, uid));
    }

    @MessagePattern(patterns.deactivateUser)
    async deactivate(@Payload("id") id: string, @Payload("uid") uid: string) {
        return await this.commandBus.execute(
            new ToggleActiveStatusCommand({ uid: id, isDeactivated: true }, uid)
        );
    }

    @MessagePattern(patterns.activateUser)
    async activate(@Payload("id") id: string, @Payload("uid") uid: string) {
        return await this.commandBus.execute(
            new ToggleActiveStatusCommand(
                { uid: id, isDeactivated: false },
                uid
            )
        );
    }

    @MessagePattern(patterns.getUser)
    async getUser(@Payload() uid: string) {
        if (!uid) return null;
        return await this.queryBus.execute(new UserQuery(uid));
    }

    @MessagePattern(patterns.getUsersView)
    async getUsersView(uid: string) {
        return await this.queryBus.execute(new UsersViewQuery(uid));
    }

    @MessagePattern(patterns.updateUserDetails)
    async updateUserDetails(
        @Payload("dto") dto: UpdateUserDetailsDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdateUserDetailsCommand(dto, uid)
        );
    }

    @MessagePattern(patterns.linkUser)
    async linkUser(
        @Payload("dto") dto: LinkUserDto,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(new LinkUserCommand(dto, uid));
    }

    @MessagePattern(patterns.getUserOptions)
    async getUserOptions() {
        return await this.queryBus.execute(new UserOptionsQuery());
    }

    @MessagePattern(patterns.getUserConnectOptions)
    async getUserResourceOptions() {
        return await this.queryBus.execute(new UserConnectOptionsQuery());
    }

    @MessagePattern(patterns.splitUser)
    async splitUser(@Payload("id") id: string, @Payload("uid") uid: string) {
        return await this.commandBus.execute(new SplitUserCommand(id, uid));
    }
}
