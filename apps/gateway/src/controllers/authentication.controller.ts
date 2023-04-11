import { Controller, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { HttpUser, Public } from "@ns/decorators";
import { SignedJwtToken } from "@ns/definitions";
import { LocalAuthGuard, SignJwtCommand } from "@ns/session";

@Controller("authentication")
export class AuthenticationController {
    constructor(private commandBus: CommandBus) {}

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post("login")
    async login(@HttpUser() uid: string): Promise<SignedJwtToken> {
        return await this.commandBus.execute(new SignJwtCommand(uid));
    }
}
