import { Controller } from "@nestjs/common";
import { EventPattern, MessagePattern, Payload } from "@nestjs/microservices";
import {
    mailerPatterns as patterns
} from "@ns/endpoints";
import {
    CredentialsCreatedEvent, PasswordResetEvent
} from "@ns/events";
import { SendgridService } from "./sendgrid.service";

@Controller()
export class MailerNatsController {
    constructor(private mailer: SendgridService) {}

    @MessagePattern(patterns.mailCredentials)
    async mailCredentials(
        @Payload("to") id: string,
        @Payload("uid") uid?: string
    ) {
        return await this.mailer.mailCredentials(id, uid);
    }

    @MessagePattern(patterns.mailWelcome)
    async mailWelcome(@Payload("to") id: string, @Payload("uid") uid: string) {
        return await this.mailer.mailWelcome(id, uid);
    }

    @EventPattern(CredentialsCreatedEvent.name)
    async handleCredentialsCreated(event: CredentialsCreatedEvent) {
        if (event.body.sendWelcomeEmail) {
            await this.mailer.mailWelcome(event.body.uid, event.uid);
        }
    }

    @EventPattern(PasswordResetEvent.name)
    async handlePasswordReset(event: PasswordResetEvent) {
        await this.mailer.mailCredentials(event.body.uid, event.uid);
    }
}
