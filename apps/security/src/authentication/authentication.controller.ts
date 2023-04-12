import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { authenticationPatterns } from "@ns/endpoints";
import { UserCreatedEvent, UserDetailsUpdatedEvent } from "@ns/events";
import { CreateCredentialsCommand } from "./create-credentials";
import { ResetPasswordCommand } from "./reset-password";
import { UpdatePasswordCommand } from "./update-password";
import { UpdateUsernameCommand } from "./update-username";
import { GetCredentialsQuery } from "./get-credentials";
import { UpdatePasswordDto } from "@ns/dto";

@Controller()
export class AuthenticationController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @MessagePattern(authenticationPatterns.updatePassword)
    async updatePassword(
        @Payload("dto") dto: UpdatePasswordDto,
        @Payload("uid") uid: string
    ) {
        console.log(dto)
        return await this.commandBus.execute(
            new UpdatePasswordCommand(dto, uid)
        );
    }

    @MessagePattern(authenticationPatterns.resetPassword)
    async resetPassword(
        @Payload("email") email: string,
        @Payload("uid") uid?: string
    ) {
        return await this.commandBus.execute(new ResetPasswordCommand(email, uid));
    }

    @MessagePattern(authenticationPatterns.getCredentials)
    async getCredentials(@Payload() uid: string) {
        return await this.queryBus.execute(new GetCredentialsQuery(uid));
    }

    @EventPattern(UserCreatedEvent.name)
    async handleUserCreated(@Payload() event: UserCreatedEvent) {
        await this.commandBus.execute(
            new CreateCredentialsCommand(
                {
                    uid: event.body.uid,
                    email: event.body.email,
                    sendWelcomeEmail: event.body.sendWelcomeEmail,
                },
                event.uid
            )
        );
    }

    @EventPattern(UserDetailsUpdatedEvent.name)
    async handleUserDetailsUpdated(@Payload() event: UserDetailsUpdatedEvent) {
        await this.commandBus.execute(
            new UpdateUsernameCommand(event.body.email, event.uid)
        );
    }
}
