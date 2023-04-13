import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { HttpUser, Public } from "@ns/decorators";
import { SignedJwtToken } from "@ns/definitions";
import { authenticationPatterns } from "@ns/endpoints";
import { NatsClient } from "@ns/nats";
import { LocalAuthGuard, SignJwtCommand } from "@ns/session";

@Controller("authentication")
export class AuthenticationController {
    constructor(private commandBus: CommandBus, private client: NatsClient) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@HttpUser() uid: string): Promise<SignedJwtToken> {
        return await this.commandBus.execute(new SignJwtCommand(uid));
    }

    @Public()
    @Post("reset-password")
    async resetPassword(@Body("email") email: string) {
        return await this.client.request(authenticationPatterns.resetPassword, { email });
    }
}
