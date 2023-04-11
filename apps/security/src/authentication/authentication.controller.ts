import { Controller } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import { authenticationPatterns } from "@ns/endpoints";
import { UserCreatedEvent, UserDetailsUpdatedEvent } from "@ns/events";
import { CreateCredentialsCommand } from "./create-credentials";
import { ResetPasswordCommand } from "./reset-password";
import { UpdatePasswordCommand } from "./update-password";
import { UpdateUsernameCommand } from "./update-username";


@Controller()
export class AuthenticationController {
    constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

    @MessagePattern(authenticationPatterns.updatePassword)
    async updatePassword(
        @Payload("password") password: string,
        @Payload("uid") uid: string
    ) {
        return await this.commandBus.execute(
            new UpdatePasswordCommand(password, uid)
        );
    }

    @MessagePattern(authenticationPatterns.resetPassword)
    async resetPassword(@Payload() email: string) {
        return await this.commandBus.execute(new ResetPasswordCommand(email));
    }

    @EventPattern(UserCreatedEvent.name)
    async handleUserCreated(@Payload() event: UserCreatedEvent) {
        await this.commandBus.execute(
            new CreateCredentialsCommand(
                event.body.uid,
                event.body.email,
                event.body.sendWelcomeMail
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
